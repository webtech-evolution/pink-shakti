// Real photographs (Unsplash) — no AI-generated imagery.
export const u = (id: string, w = 900, h = 1100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const photos = {
  visionCommunity: u("photo-1543269865-cbf427effbad", 900, 675),
  pillarHealth: u("photo-1571019613454-1cb2f99b2d8b"),
  pillarLeadership: u("photo-1573497019940-1c28c88b4f3e"),
  pillarWealth: u("photo-1552664730-d307ca884978"),
  pillarEducation: u("photo-1524178232363-1fb2b075b655"),
  pillarJustice: u("photo-1607827448387-a67db1383b59"),
  pillarSociety: u("photo-1509099836639-18ba1795216d"),
  pillarMedia: u("photo-1516321318423-f06f85e504b3"),
  pillarInspiration: u("photo-1531983412531-1f49a365ffed"),
  gallery: [
    u("photo-1522202176988-66273c2fd55f", 900, 650),
    u("photo-1541823709867-1b206113eafd", 900, 650),
    u("photo-1573164713988-8665fc963095", 900, 650),
    u("photo-1517048676732-d65bc937f952", 900, 650),
    u("photo-1591115765373-5207764f72e7", 900, 650),
    u("photo-1560250097-0b93528c311a", 900, 650),
  ],
};
