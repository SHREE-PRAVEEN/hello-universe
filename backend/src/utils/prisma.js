// In-memory mock database for demo/dev when Prisma packages are unavailable.
// Replace with real PrismaClient in production.

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const data = {
  users: [],
  courses: [],
  lessons: [],
  progress: [],
  guides: [],
  solutions: [],
  products: [],
  carts: [],
  cartItems: [],
  orders: [],
  orderItems: [],
  reviews: [],
  savedItems: [],
};

const seed = () => {
  if (data.products.length > 0) return;

  const admin = {
    id: uid(),
    name: "Admin",
    email: "admin@hello-universe.dev",
    passwordHash: "",
    role: "ADMIN",
    createdAt: now(),
    updatedAt: now(),
  };

  const guide = {
    id: uid(),
    slug: "line-follower-bot",
    title: "Line Follower Bot",
    description: "Build a beginner line follower robot",
    materials: [],
    steps: [],
    tags: ["beginner", "line-follower"],
    authorId: admin.id,
    createdAt: now(),
    updatedAt: now(),
  };

  const solution = {
    id: uid(),
    slug: "smart-farm-monitor",
    title: "Smart Farm Monitor",
    category: "AGRICULTURE",
    problemDescription: "Automated soil and environment monitoring.",
    components: [],
    estimatedCost: 280,
    softwareTools: ["Arduino IDE"],
    tags: ["agriculture", "iot"],
    buildGuideId: guide.id,
    createdAt: now(),
    updatedAt: now(),
  };

  const course = {
    id: uid(),
    slug: "robotics-foundations",
    title: "Robotics Foundations",
    description: "Core robotics concepts and prototyping.",
    level: "Beginner",
    tags: ["robotics", "basics"],
    createdAt: now(),
    updatedAt: now(),
  };

  const lesson = {
    id: uid(),
    courseId: course.id,
    title: "Introduction to Robotics",
    order: 1,
    content: "What is robotics and where it is used.",
    createdAt: now(),
    updatedAt: now(),
  };

  const products = [
    {
      id: uid(),
      slug: "ultrasonic-sensor-hc-sr04",
      name: "Ultrasonic Sensor HC-SR04",
      category: "SENSORS",
      description: "Distance sensor module for obstacle detection.",
      price: 6.99,
      stock: 120,
      tags: ["sensor", "distance"],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: uid(),
      slug: "l298n-motor-driver",
      name: "L298N Motor Driver",
      category: "CONTROLLERS",
      description: "Dual H-bridge motor driver board.",
      price: 8.49,
      stock: 90,
      tags: ["driver", "motor"],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: uid(),
      slug: "arduino-uno-r3",
      name: "Arduino UNO R3",
      category: "CONTROLLERS",
      description: "Popular microcontroller board for robotics.",
      price: 14.99,
      stock: 60,
      tags: ["arduino", "controller"],
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  data.users.push(admin);
  data.guides.push(guide);
  data.solutions.push(solution);
  data.courses.push(course);
  data.lessons.push(lesson);
  data.products.push(...products);
};

seed();

const withIncludes = {
  cart(cart) {
    if (!cart) return null;
    const items = data.cartItems
      .filter((item) => item.cartId === cart.id)
      .map((item) => ({
        ...item,
        product: data.products.find((product) => product.id === item.productId) || null,
      }));
    return { ...cart, items };
  },
  order(order) {
    const items = data.orderItems
      .filter((item) => item.orderId === order.id)
      .map((item) => ({
        ...item,
        product: data.products.find((product) => product.id === item.productId) || null,
      }));
    return { ...order, items };
  },
  guide(guide) {
    if (!guide) return null;
    const author = data.users.find((user) => user.id === guide.authorId);
    return { ...guide, author: author ? { id: author.id, name: author.name } : null };
  },
  product(product) {
    if (!product) return null;
    const reviews = data.reviews
      .filter((review) => review.productId === product.id)
      .map((review) => {
        const user = data.users.find((item) => item.id === review.userId);
        return { ...review, user: user ? { id: user.id, name: user.name } : null };
      });
    return { ...product, reviews };
  },
  course(course) {
    if (!course) return null;
    const lessons = data.lessons
      .filter((lesson) => lesson.courseId === course.id)
      .sort((a, b) => a.order - b.order);
    return { ...course, lessons };
  },
};

const prisma = {
  user: {
    async findUnique({ where }) {
      if (where.email) return data.users.find((user) => user.email === where.email) || null;
      if (where.id) return data.users.find((user) => user.id === where.id) || null;
      return null;
    },
    async create({ data: payload, select }) {
      const user = {
        id: uid(),
        role: "USER",
        ...payload,
        createdAt: now(),
        updatedAt: now(),
      };
      data.users.push(user);

      if (!select) return user;
      const selected = {};
      Object.keys(select).forEach((key) => {
        selected[key] = user[key];
      });
      return selected;
    },
    async update({ where, data: payload, select }) {
      const user = await this.findUnique({ where });
      if (!user) return null;
      Object.assign(user, payload, { updatedAt: now() });
      if (!select) return user;
      const selected = {};
      Object.keys(select).forEach((key) => {
        selected[key] = user[key];
      });
      return selected;
    },
  },

  savedItem: {
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.savedItems.push(record);
      return record;
    },
  },

  course: {
    async findMany() {
      return data.courses.map((course) => withIncludes.course(course));
    },
    async findUnique({ where }) {
      const course = data.courses.find((item) => item.slug === where.slug || item.id === where.id) || null;
      return withIncludes.course(course);
    },
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.courses.push(record);
      return record;
    },
    async update({ where, data: payload }) {
      const course = data.courses.find((item) => item.id === where.id);
      if (!course) return null;
      Object.assign(course, payload, { updatedAt: now() });
      return course;
    },
  },

  lesson: {
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.lessons.push(record);
      return record;
    },
  },

  progress: {
    async upsert({ where, update, create }) {
      const current = data.progress.find(
        (item) => item.userId === where.userId_lessonId.userId && item.lessonId === where.userId_lessonId.lessonId,
      );

      if (current) {
        Object.assign(current, update, { updatedAt: now() });
        return current;
      }

      const record = { id: uid(), ...create, createdAt: now(), updatedAt: now() };
      data.progress.push(record);
      return record;
    },
  },

  solution: {
    async findMany({ where }) {
      let items = [...data.solutions];
      if (where?.category) items = items.filter((item) => item.category === where.category);
      if (where?.tags?.has) items = items.filter((item) => item.tags.includes(where.tags.has));
      if (where?.OR?.length) {
        const term = (where.OR[0].title?.contains || "").toLowerCase();
        items = items.filter(
          (item) => item.title.toLowerCase().includes(term) || item.problemDescription.toLowerCase().includes(term),
        );
      }
      return items;
    },
    async findUnique({ where }) {
      return data.solutions.find((item) => item.slug === where.slug || item.id === where.id) || null;
    },
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.solutions.push(record);
      return record;
    },
  },

  product: {
    async findMany({ where }) {
      let items = [...data.products];
      if (where?.id?.in) items = items.filter((item) => where.id.in.includes(item.id));
      if (where?.category) items = items.filter((item) => item.category === where.category);
      if (where?.tags?.has) items = items.filter((item) => item.tags.includes(where.tags.has));
      if (where?.price?.lte !== undefined) items = items.filter((item) => Number(item.price) <= Number(where.price.lte));
      if (where?.OR?.length) {
        const term = (where.OR[0].name?.contains || "").toLowerCase();
        items = items.filter((item) => item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term));
      }
      return items.map((item) => withIncludes.product(item));
    },
    async findUnique({ where }) {
      let item = null;
      if (where.id) item = data.products.find((product) => product.id === where.id) || null;
      if (!item && where.slug) item = data.products.find((product) => product.slug === where.slug) || null;
      return withIncludes.product(item);
    },
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.products.push(record);
      return record;
    },
  },

  cart: {
    async findUnique({ where }) {
      const cart = data.carts.find((item) => item.userId === where.userId) || null;
      return withIncludes.cart(cart);
    },
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.carts.push(record);
      return record;
    },
  },

  cartItem: {
    async upsert({ where, update, create }) {
      const existing = data.cartItems.find(
        (item) => item.cartId === where.cartId_productId.cartId && item.productId === where.cartId_productId.productId,
      );
      if (existing) {
        if (update.quantity?.increment) existing.quantity += update.quantity.increment;
        existing.updatedAt = now();
        return existing;
      }
      const record = { id: uid(), ...create, createdAt: now(), updatedAt: now() };
      data.cartItems.push(record);
      return record;
    },
  },

  review: {
    async upsert({ where, update, create }) {
      const existing = data.reviews.find(
        (item) => item.userId === where.userId_productId.userId && item.productId === where.userId_productId.productId,
      );
      if (existing) {
        Object.assign(existing, update, { updatedAt: now() });
        return existing;
      }
      const record = { id: uid(), ...create, createdAt: now(), updatedAt: now() };
      data.reviews.push(record);
      return record;
    },
  },

  guide: {
    async findMany({ where }) {
      let items = [...data.guides];
      if (where?.tags?.has) items = items.filter((item) => item.tags.includes(where.tags.has));
      if (where?.OR?.length) {
        const term = (where.OR[0].title?.contains || "").toLowerCase();
        items = items.filter((item) => item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term));
      }
      return items.map((item) => withIncludes.guide(item));
    },
    async findUnique({ where }) {
      const item = data.guides.find((guide) => guide.slug === where.slug || guide.id === where.id) || null;
      return withIncludes.guide(item);
    },
    async create({ data: payload }) {
      const record = { id: uid(), ...payload, createdAt: now(), updatedAt: now() };
      data.guides.push(record);
      return record;
    },
  },

  order: {
    async findMany({ where }) {
      return data.orders.filter((order) => order.userId === where.userId).map((order) => withIncludes.order(order));
    },
    async create({ data: payload }) {
      const record = {
        id: uid(),
        userId: payload.userId,
        status: payload.status || "PENDING",
        totalAmount: payload.totalAmount,
        createdAt: now(),
        updatedAt: now(),
      };
      data.orders.push(record);

      const createItems = payload.items?.create || [];
      createItems.forEach((item) => {
        data.orderItems.push({
          id: uid(),
          orderId: record.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          createdAt: now(),
          updatedAt: now(),
        });
      });

      return withIncludes.order(record);
    },
  },
};

module.exports = prisma;
