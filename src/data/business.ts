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
  // The groupings and item lists used on the current website, plus gift sets.
  groups: [
    {
      title: 'Corporate clothing',
      category: 'Corporate clothing',
      items: 'Shirts, blouses, men’s and ladies trousers, skirts, dresses',
      image: '/products/bas-7759-lb.webp',
    },
    {
      title: 'Uniforms & workwear',
      category: 'Uniforms & workwear',
      items: 'Workwear, overalls, PPE, denim, chefs’ clothing, golf shirts',
      image: '/products/alt-1101-r-lifestyle01.webp',
    },
    {
      title: 'Promotional clothing',
      category: 'Promotional clothing',
      items: 'Golf shirts, t-shirts, brand names, caps and hats, aprons, kids’ range',
      image: '/products/alt-bbm-dg1-mofr-027-no-logo.webp',
    },
    {
      title: 'Marketing material & gifts',
      category: 'Marketing material & gifts',
      items: 'Bags, coolers, mugs, pens, umbrellas, flash drives, journals, banners',
      image: '/products/um-ub-27-b-lifestyle-ai-no-logo.webp',
    },
    {
      title: 'Gift sets',
      category: 'Gift sets',
      items: 'Executive gifts, journal and pen sets, houseware, glassware',
      image: '/gifts/an-gft-001-01-hero.webp',
    },
  ],
  // From the Linton Merch Facebook page (facebook.com/lintonenterprisessa), read 11 Oct 2026.
  slogan: 'Dress to impress and brand for success.',
  facebookRating: { percent: 92, reviews: 5 },
  promises: ['Nationwide delivery', 'In-house branding', 'Fast turnaround', 'Personalised service'],
  // Branding methods named on lintonent.co.za and on the Facebook flyers.
  methods: [
    'Embroidery',
    'Screen printing',
    'Pad printing',
    'Engraving',
    'Embossing',
    'Sublimation',
    'Digital branding',
  ],
  // Supplier and brand-name ranges shown on lintonent.co.za.
  brands: [
    'Altitude',
    'Barron',
    'Pro-Active',
    'Rolando',
    'Slazenger',
    'Cutter & Buck',
    'Elevate',
    'Ogio',
    'Polo',
    'Billboard',
  ],
  mission:
    'To add value to our client’s buying experience by being caring, reliable and efficient.',
  // Quoted verbatim from the testimonials on lintonent.co.za (read 11 October 2026).
  // Confirm with the client before public release.
  testimonials: [
    {
      quote:
        'Always professional, always on time (despite tight deadlines) and always with a smile.',
      name: 'Bertha Spangenberg',
      role: 'Marketing, Communications & PR Manager, Africa & Middle East, Arysta LifeScience',
    },
    {
      quote:
        'We have had the pleasure of dealing with the team from Linton Enterprises for a number of years and they are absolute stars!',
      name: 'Kevin & Candice Palmer',
      role: 'Palmer Projects and Impangele B&B, Howick',
    },
    {
      quote:
        'I have ordered promotional items from her company on many occasions and have found her service to be excellent.',
      name: 'Shirley Combe',
      role: 'Business owner, Pay Solutions',
    },
    {
      quote:
        'Linda has been in the promotional business for many, many years. She is professional and organised.',
      name: 'Tina Cartwright',
      role: 'Sales director',
    },
    {
      quote: 'Thank you for making my dream REAL!',
      name: 'Sazie Zwane',
      role: 'Customer',
    },
  ],
  social: {
    facebook: 'https://www.facebook.com/pages/Linton-Enterprises/388180024533955',
    instagram: 'https://www.instagram.com/lintonenterprisessa/',
  },
} as const
