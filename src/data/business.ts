// Business facts. Source: the public Linton Enterprises website (lintonent.co.za), read on
// 9 October 2026, plus the WhatsApp number supplied by the project owner. Confirm with the
// client before any public release. Do not add claims that are not in this file.
export const business = {
  tradingName: 'Linton Merch',
  legalName: 'Linton Enterprises',
  tagline: 'Corporate clothing, gifts & uniforms',
  town: 'Meyerton',
  addressLines: ['Unit 7 Trichardts Fontein', '82 Rooibok Road', 'Highbury, Meyerton, 1961'],
  phoneDisplay: '083 225 9886',
  phoneHref: 'tel:+27832259886',
  whatsappDisplay: '082 550 5251',
  email: 'linda@lintonent.co.za',
  hours: [
    { days: 'Monday – Thursday', time: '08:30 – 16:30' },
    { days: 'Friday', time: '08:30 – 15:00' },
  ],
  founded: 1999,
  // Wording adapted from the "About" text on lintonent.co.za. Confirm with the client.
  manifesto:
    'Linton Enterprises sources and supplies the products that best meet each customer’s marketing needs, from golf shirts to staff uniforms and corporate gifts.',
  story: [
    'Linton Enterprises was a dream before the founders knew what kind of business it would be. Tony and Linda combined their names to make LINTON and ENTERPRISES, still waiting for a business concept to match.',
    'The obvious business is supplying promotional clothing, uniforms and corporate gifts, anything that promotes or markets a business. Service is the actual business: sourcing and supplying the products that best meet each customer’s marketing needs.',
    'Linton Enterprises represents a number of local manufacturers and suppliers, and keeps an eye out for new products.',
  ],
  milestones: [
    {
      year: '1999',
      text: 'While marketing a customised range of golf shirts to customers in Swaziland, a market for golf-related clothing and products opened up.',
    },
    {
      year: '2001',
      text: 'After building a decent client base, Linton Enterprises registered as a CC.',
    },
    { year: '2018', text: 'The business converted to a (Pty) Ltd.' },
  ],
  // The four groupings used on the current website.
  groups: [
    {
      title: 'Corporate clothing',
      category: 'Corporate clothing',
      items: 'Shirts, blouses, trousers, skirts, dresses',
    },
    {
      title: 'Uniforms & workwear',
      category: 'Uniforms & workwear',
      items: 'Work wear, denim, chefs’ clothing, golf shirts',
    },
    {
      title: 'Promotional clothing',
      category: 'Promotional clothing',
      items: 'T-shirts, golf shirts, caps, aprons, kids’ range',
    },
    {
      title: 'Marketing material & gifts',
      category: 'Marketing material & gifts',
      items: 'Bags, mugs, journals, key rings, flash drives, banners',
    },
  ],
} as const
