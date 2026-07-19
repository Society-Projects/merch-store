export interface UserInput {
  id: string
  question: string
  isImageInput: boolean
  isRequired: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  isVisible: boolean
  positions: string[]
  userInputs: UserInput[]
}

export const SOCIETY_CONFIG = {
  name: 'OWASP Student Chapter',
  shortName: 'OWASP',
  tagline: 'Official merchandise for our community',
  upiId: 'owasp@upi',
}

export const products: Product[] = [
  {
    id: 'owasp-hoodie',
    name: 'Chapter Hoodie',
    description:
      'Premium heavyweight hoodie with the chapter logo embroidered on chest. 80% cotton, 20% polyester fleece — warm, structured, and built for marathon debugging sessions. Pre-shrunk for a consistent fit.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&auto=format',
    price: 1799,
    isVisible: true,
    positions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    userInputs: [
      { id: 'size', question: 'Select your size', isImageInput: false, isRequired: true },
      { id: 'name-emb', question: 'Name for embroidery (optional, max 20 chars)', isImageInput: false, isRequired: false },
    ],
  },
  {
    id: 'ieee-polo',
    name: 'IEEE Polo Shirt',
    description:
      'Clean, professional polo with IEEE logo embroidery on left chest. Moisture-wicking pique fabric keeps you composed during industry visits and presentations. Available in black.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&h=800&fit=crop&auto=format',
    price: 1299,
    isVisible: true,
    positions: ['S', 'M', 'L', 'XL'],
    userInputs: [
      { id: 'size', question: 'Select your size', isImageInput: false, isRequired: true },
      { id: 'name-tag', question: 'Your name for the name tag', isImageInput: false, isRequired: true },
    ],
  },
  {
    id: 'acm-tee',
    name: 'ACM Hackathon Tee',
    description:
      'Limited edition tee from the annual 24-hour hackathon. Soft 180gsm ring-spun cotton, relaxed unisex fit. A quiet flex for everyone who made it to the final submissions.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format',
    price: 799,
    isVisible: true,
    positions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    userInputs: [
      { id: 'size', question: 'Select your size', isImageInput: false, isRequired: true },
    ],
  },
  {
    id: 'gdsc-mug',
    name: 'GDSC Ceramic Mug',
    description:
      '350ml ceramic mug with GDSC logo. Microwave and dishwasher safe. The only thing that should start your morning besides a standups. Comes in a gift box.',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop&auto=format',
    price: 649,
    isVisible: true,
    positions: [],
    userInputs: [
      { id: 'custom-msg', question: 'Custom message on mug (max 30 chars, optional)', isImageInput: false, isRequired: false },
    ],
  },
  {
    id: 'owasp-cap',
    name: 'OWASP Security Cap',
    description:
      'Structured six-panel cap with embroidered OWASP logo. UV-protective fabric, adjustable buckle strap. Chapter members get priority access — upload your membership proof below.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&auto=format',
    price: 849,
    isVisible: true,
    positions: ['One Size'],
    userInputs: [
      { id: 'member-proof', question: 'Upload your chapter membership ID / proof', isImageInput: true, isRequired: true },
    ],
  },
  {
    id: 'ieee-tote',
    name: 'Circuit Board Tote Bag',
    description:
      '15L natural canvas tote with a circuit board print. Sturdy enough for your laptop, notebooks, and week-long regrets. Eco-friendly, reusable, unmistakably engineering.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=800&fit=crop&auto=format',
    price: 699,
    isVisible: true,
    positions: [],
    userInputs: [],
  },
  {
    id: 'acm-sticker-pack',
    name: 'Developer Sticker Pack',
    description:
      '10 high-quality vinyl stickers — chapter logos, coding memes, and terminal quotes. Waterproof, UV-resistant, laptop-grade. No laptop should ship without them.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=800&fit=crop&auto=format',
    price: 299,
    isVisible: true,
    positions: [],
    userInputs: [],
  },
  {
    id: 'gdsc-bottle',
    name: 'GDSC Insulated Bottle',
    description:
      '500ml double-wall vacuum insulated stainless steel bottle. Keeps drinks hot 12h, cold 24h. GDSC logo laser-etched — not a sticker, not going anywhere.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&auto=format',
    price: 1099,
    isVisible: true,
    positions: [],
    userInputs: [],
  },
]

export const formatPrice = (price: number) =>
  `₹${price.toLocaleString('en-IN')}`
