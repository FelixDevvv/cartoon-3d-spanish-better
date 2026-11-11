import * as THREE from "three";

export type Cartoon3DStyle = "storybook" | "roblox";

export type Cartoon3DOptions = {
  seed?: number;
  skin?: string;
  hair?: string;
  shirt?: string;
  pants?: string;
  shoes?: string;
  hairStyle?: "cap" | "bob" | "short" | "ponytail" | "messy";
  body?: "kid" | "adult" | "stout";
  accessory?: "none" | "backpack" | "hat" | "glasses" | "scarf";
  expression?: "happy" | "neutral" | "surprised";
};

const PAL = {
  skin: "#F4C7A1",
  skinShade: "#D99C78",
  hair: "#1D1B22",
  shirt: "#F4F0E8",
  pants: "#A9D7E8",
  shoes: "#5A4539",
  ink: "#241726",
};

const mat = (color: string, roughness = 0.82) =>
  new THREE.MeshToonMaterial({ color, roughness });

const box = (w: number, h: number, d: number, m: THREE.Material, bevel = 0.12) => {
  const s = new THREE.Shape();
  const r = Math.min(bevel, w / 2 - 0.001, h / 2 - 0.001);
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: bevel * 0.45, bevelSize: bevel * 0.45, bevelSegments: 3, curveSegments: 8 });
  g.translate(0, 0, -d / 2);
  return new THREE.Mesh(g, m);
};

const capsule = (r: number, len: number, m: THREE.Material) =>
  new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 16), m);

const sphere = (r: number, m: THREE.Material) =>
  new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m);

const rng = (seed: number) => {
  let x = Math.sin(seed * 999.91) * 43758.5453;
  return () => { x = Math.sin(x) * 43758.5453; return x - Math.floor(x); };
};

function addFace(root: THREE.Group, style: Cartoon3DStyle, expression: Cartoon3DOptions["expression"], z = 0.38) {
  const dark = mat(PAL.ink);
  const eye = (x: number) => {
    const e = sphere(style === "roblox" ? 0.065 : 0.075, dark);
    e.position.set(x, 0.15, z);
    root.add(e);
  };
  eye(-0.16); eye(0.16);

  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(expression === "surprised" ? 0.09 : 0.12, 0.025, 8, 20, expression === "happy" ? Math.PI : Math.PI * 1.5),
    dark,
  );
  mouth.rotation.x = Math.PI / 2;
  mouth.position.set(0, -0.10, z + 0.01);
  root.add(mouth);

  if (expression === "surprised") {
    mouth.scale.set(0.75, 1.2, 1);
  }
}

function addHair(root: THREE.Group, style: Cartoon3DOptions["hairStyle"], color: string) {
  const m = mat(color);
  if (style === "bob") {
    const cap = sphere(0.56, m);
    cap.scale.set(1.02, 0.72, 0.95);
    cap.position.y = 0.38;
    root.add(cap);
    const sideL = sphere(0.27, m); sideL.scale.y = 1.25; sideL.position.set(-0.46, 0.02, 0.0);
    const sideR = sideL.clone(); sideR.position.x = 0.46;
    root.add(sideL, sideR);
  } else if (style === "ponytail") {
    const cap = sphere(0.53, m); cap.scale.set(1, 0.7, 0.92); cap.position.y = 0.4;
    root.add(cap);
    const pony = sphere(0.24, m); pony.scale.set(0.8, 1.5, 0.8); pony.position.set(0.48, 0.28, -0.25);
    root.add(pony);
  } else if (style === "cap") {
    const cap = sphere(0.52, m); cap.scale.set(1, 0.48, 0.92); cap.position.y = 0.43;
    root.add(cap);
    const brim = box(0.72, 0.08, 0.32, m, 0.05); brim.position.set(0, 0.39, 0.42);
    root.add(brim);
  } else {
    const cap = sphere(0.54, m); cap.scale.set(1, 0.62, 0.92); cap.position.y = 0.4;
    root.add(cap);
    if (style === "messy") {
      for (let i = 0; i < 5; i++) {
        const tuft = sphere(0.15, m);
        tuft.position.set((i - 2) * 0.17, 0.72 + (i % 2) * 0.06, 0.03);
        root.add(tuft);
      }
    }
  }
}

export function createCartoon3DCharacter(options: Cartoon3DOptions = {}) {
  const o = {
    seed: 1,
    skin: PAL.skin,
    hair: PAL.hair,
    shirt: PAL.shirt,
    pants: PAL.pants,
    shoes: PAL.shoes,
    hairStyle: "bob" as const,
    body: "kid" as const,
    accessory: "none" as const,
    expression: "happy" as const,
    ...options,
  };

  const root = new THREE.Group();
  root.name = "Cartoon3DCharacter";
  root.userData.characterStyle = "storybook-3d";
  root.userData.seed = o.seed;

  const scale = o.body === "adult" ? 1.18 : o.body === "stout" ? 1.06 : 1;
  root.scale.setScalar(scale);

  const skin = mat(o.skin);
  const shirt = mat(o.shirt);
  const pants = mat(o.pants);
  const shoes = mat(o.shoes);

  const head = sphere(0.55, skin);
  head.scale.set(0.98, 1.03, 0.94);
  head.position.y = 1.82;
  root.add(head);

  const neck = capsule(0.15, 0.14, skin); neck.position.y = 1.31; root.add(neck);

  const torso = box(o.body === "stout" ? 0.88 : 0.78, 0.78, 0.45, shirt, 0.14);
  torso.position.y = 0.94; root.add(torso);

  const hip = box(0.70, 0.30, 0.40, pants, 0.10);
  hip.position.y = 0.48; root.add(hip);

  for (const side of [-1, 1]) {
    const arm = capsule(0.12, 0.48, shirt);
    arm.position.set(side * 0.52, 0.95, 0);
    arm.rotation.z = side * -0.16;
    root.add(arm);

    const hand = sphere(0.13, skin);
    hand.position.set(side * 0.57, 0.61, 0.01);
    root.add(hand);

    const leg = capsule(0.15, 0.55, pants);
    leg.position.set(side * 0.20, 0.08, 0);
    root.add(leg);

    const shoe = box(0.34, 0.16, 0.52, shoes, 0.06);
    shoe.position.set(side * 0.20, -0.28, 0.12);
    root.add(shoe);
  }

  const face = new THREE.Group();
  face.position.set(0, 1.82, 0);
  root.add(face);
  addFace(face, "storybook", o.expression);
  addHair(face, o.hairStyle, o.hair);

  if (o.accessory === "glasses") {
    const gm = mat("#2B2B31");
    for (const x of [-0.16, 0.16]) {
      const g = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 8, 20), gm);
      g.position.set(x, 0.16, 0.42); face.add(g);
    }
    const bridge = box(0.12, 0.025, 0.03, gm, 0.01); bridge.position.set(0, 0.16, 0.42); face.add(bridge);
  }

  if (o.accessory === "backpack") {
    const b = box(0.52, 0.62, 0.20, mat("#D85D3A"), 0.10);
    b.position.set(0, 0.88, -0.34);
    root.add(b);
  }

  if (o.accessory === "scarf") {
    const s = box(0.70, 0.12, 0.48, mat("#E4A73B"), 0.04);
    s.position.set(0, 1.35, 0);
    root.add(s);
  }

  root.traverse((x) => {
    if (x instanceof THREE.Mesh) {
      x.castShadow = true;
      x.receiveShadow = true;
    }
  });

  return root;
}

export function createRobloxCharacter(options: Cartoon3DOptions = {}) {
  const o = {
    seed: 1,
    skin: "#F2B58D",
    hair: "#17171A",
    shirt: "#4C7DFF",
    pants: "#D8D8E0",
    shoes: "#24242A",
    hairStyle: "short" as const,
    expression: "happy" as const,
    ...options,
  };

  const root = new THREE.Group();
  root.name = "RobloxCharacter3D";
  root.userData.characterStyle = "roblox-3d";
  root.userData.seed = o.seed;

  const skin = mat(o.skin);
  const shirt = mat(o.shirt);
  const pants = mat(o.pants);
  const shoes = mat(o.shoes);

  const head = box(0.82, 0.82, 0.82, skin, 0.08);
  head.position.y = 1.82;
  root.add(head);

  const torso = box(0.90, 0.95, 0.50, shirt, 0.07);
  torso.position.y = 0.98;
  root.add(torso);

  for (const side of [-1, 1]) {
    const arm = box(0.30, 0.82, 0.36, skin, 0.06);
    arm.position.set(side * 0.60, 0.99, 0);
    root.add(arm);

    const leg = box(0.38, 0.78, 0.40, pants, 0.06);
    leg.position.set(side * 0.22, 0.08, 0);
    root.add(leg);

    const shoe = box(0.43, 0.18, 0.52, shoes, 0.05);
    shoe.position.set(side * 0.22, -0.40, 0.10);
    root.add(shoe);
  }

  const face = new THREE.Group();
  face.position.set(0, 1.82, 0);
  root.add(face);
  addFace(face, "roblox", o.expression, 0.43);
  addHair(face, o.hairStyle, o.hair);

  root.traverse((x) => {
    if (x instanceof THREE.Mesh) {
      x.castShadow = true;
      x.receiveShadow = true;
    }
  });

  return root;
}

export const CHARACTER_PRESETS = {
  child: { body: "kid", hairStyle: "bob", shirt: "#F4F0E8", pants: "#A9D7E8" },
  teen: { body: "adult", hairStyle: "short", shirt: "#5B82E8", pants: "#3C4656" },
  teacher: { body: "adult", hairStyle: "short", shirt: "#E9E3D6", pants: "#4A5364", accessory: "glasses" },
  explorer: { body: "adult", hairStyle: "messy", shirt: "#C97A42", pants: "#4B6472", accessory: "backpack" },
  robloxClassic: { shirt: "#4C7DFF", pants: "#D8D8E0", hairStyle: "short" },
  robloxBuilder: { shirt: "#E05B4F", pants: "#5D6472", hairStyle: "cap", accessory: "backpack" },
} as const;

export function createCharacter(style: Cartoon3DStyle, preset: keyof typeof CHARACTER_PRESETS, extra: Cartoon3DOptions = {}) {
  const base = CHARACTER_PRESETS[preset];
  return style === "roblox"
    ? createRobloxCharacter({ ...base, ...extra })
    : createCartoon3DCharacter({ ...base, ...extra });
}
