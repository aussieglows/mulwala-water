// The principal's profile (spec Part 6.8). Ships with null fields by design —
// <PrincipalProfile /> renders a deliberate signed statement until Laura fills these in.
// Filling this object in later is the whole change; no redesign needed.

export const principal: {
  name: string | null;
  role: string | null;
  photo: string | null;
  linkedin: string | null;
  bio: string | null;
  career: string[];
} = {
  name: null, // [[LAURA]]
  role: null, // [[LAURA]]
  photo: null, // [[LAURA]]
  linkedin: null, // [[LAURA]]
  bio: null, // [[LAURA]]
  career: [], // [[LAURA]]
};
