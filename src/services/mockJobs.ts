import type { Job, JobFilters, JobSearchResult } from "@/types/jobs";

const employers = {
  paystack: {
    id: "paystack",
    name: "Paystack",
    initials: "P",
    industry: "Financial technology",
    isVerified: true,
    location: "Lagos, Nigeria",
  },
  talentQL: {
    id: "talentql",
    name: "TalentQL",
    initials: "TQ",
    industry: "Technology",
    isVerified: true,
    location: "Lagos, Nigeria",
  },
  herconomy: {
    id: "herconomy",
    name: "Herconomy",
    initials: "H",
    industry: "Financial services",
    isVerified: true,
    location: "Lagos, Nigeria",
  },
  moniepoint: {
    id: "moniepoint",
    name: "Moniepoint",
    initials: "M",
    industry: "Financial technology",
    isVerified: true,
    location: "Lagos, Nigeria",
  },
  andela: {
    id: "andela",
    name: "Andela",
    initials: "A",
    industry: "Technology",
    isVerified: true,
    location: "Lagos, Nigeria",
  },
  uLesson: {
    id: "ulesson",
    name: "uLesson",
    initials: "u",
    industry: "Education technology",
    isVerified: false,
    location: "Abuja, Nigeria",
  },
} satisfies Record<string, Job["employer"]>;

const mockJobs: Job[] = [
  {
    id: "job-001",
    slug: "junior-product-designer-paystack",
    title: "Junior Product Designer",
    employer: employers.paystack,
    state: "Lagos",
    city: "Lagos",
    isRemote: false,
    type: "Full-time",
    level: "Junior",
    category: "Design",
    salaryMin: 250000,
    salaryMax: 400000,
    salaryPeriod: "monthly",
    summary:
      "Help shape clear, thoughtful payment experiences for people and businesses.",
    description:
      "Work with product managers and engineers to make everyday payments simpler. You will contribute to discovery, wireframes, prototypes, and polished product experiences.",
    requirements: [
      "A portfolio showing product or user-interface design work",
      "Comfort using Figma and explaining design decisions",
      "Curiosity about how people use digital financial products",
    ],
    postedAt: "2026-10-18",
    isFeatured: true,
    whatsappPhone: "+2348000000001",
  },
  {
    id: "job-002",
    slug: "graduate-software-engineer-talentql",
    title: "Graduate Software Engineer",
    employer: employers.talentQL,
    state: "Lagos",
    city: "Yaba",
    isRemote: true,
    type: "NYSC-friendly",
    level: "Entry-level",
    category: "Engineering",
    salaryMin: 300000,
    salaryMax: 450000,
    salaryPeriod: "monthly",
    summary:
      "Start your engineering career building useful products with a supportive team.",
    description:
      "Join a small product team as an early-career engineer. You will ship customer-facing features, learn through code reviews, and work closely with experienced teammates.",
    requirements: [
      "A degree, bootcamp background, or equivalent project experience",
      "Working knowledge of JavaScript or TypeScript",
      "Able to share a project you have built or contributed to",
    ],
    postedAt: "2026-10-17",
    isFeatured: true,
    whatsappPhone: "+2348000000002",
  },
  {
    id: "job-003",
    slug: "customer-success-associate-herconomy",
    title: "Customer Success Associate",
    employer: employers.herconomy,
    state: "Lagos",
    city: "Ikeja",
    isRemote: false,
    type: "Full-time",
    level: "Entry-level",
    category: "Customer Success",
    salaryMin: 180000,
    salaryMax: 260000,
    salaryPeriod: "monthly",
    summary:
      "Support members and help them get more value from their financial tools.",
    description:
      "Be a friendly first point of contact for customers. You will respond to questions, document feedback, and work with product and operations to resolve issues.",
    requirements: [
      "Clear written and spoken communication",
      "Comfort learning digital tools and support workflows",
      "A reliable internet connection and attention to detail",
    ],
    postedAt: "2026-10-16",
    isFeatured: true,
  },
  {
    id: "job-004",
    slug: "frontend-developer-moniepoint",
    title: "Frontend Developer Intern",
    employer: employers.moniepoint,
    state: "Oyo",
    city: "Ibadan",
    isRemote: true,
    type: "Internship",
    level: "Entry-level",
    category: "Engineering",
    salaryMin: 150000,
    salaryMax: 220000,
    salaryPeriod: "monthly",
    summary:
      "Build accessible interfaces and learn modern frontend practices on the job.",
    description:
      "Pair with the frontend team to improve web experiences, fix interface issues, and grow your skills through practical, mentored work.",
    requirements: [
      "Foundational HTML, CSS, and JavaScript",
      "Interest in React and accessible interface design",
      "A learning mindset and willingness to ask questions",
    ],
    postedAt: "2026-10-15",
    isFeatured: false,
  },
  {
    id: "job-005",
    slug: "people-operations-assistant-andela",
    title: "People Operations Assistant",
    employer: employers.andela,
    state: "FCT",
    city: "Abuja",
    isRemote: false,
    type: "Contract",
    level: "Junior",
    category: "Operations",
    salaryMin: 220000,
    salaryMax: 300000,
    salaryPeriod: "monthly",
    summary:
      "Help create a smooth, welcoming experience for a growing distributed team.",
    description:
      "Support the people team with onboarding coordination, documentation, and employee requests. This is a hands-on role with room to grow.",
    requirements: [
      "Strong organisation and follow-through",
      "Comfort with spreadsheets and online collaboration tools",
      "Good judgement when handling confidential information",
    ],
    postedAt: "2026-10-14",
    isFeatured: false,
  },
  {
    id: "job-006",
    slug: "freelance-content-writer-ulesson",
    title: "Freelance Content Writer",
    employer: employers.uLesson,
    state: "FCT",
    city: "Abuja",
    isRemote: true,
    type: "Freelance/Gig",
    level: "Junior",
    category: "Marketing",
    salaryMin: 80000,
    salaryMax: 150000,
    salaryPeriod: "monthly",
    summary:
      "Create helpful, engaging learning content for young Nigerian audiences.",
    description:
      "Work with the content team on short-form educational and marketing content. The role is remote and project-based, with clear briefs and feedback.",
    requirements: [
      "Writing samples that show a clear, engaging voice",
      "Ability to research and meet agreed deadlines",
      "Interest in education and learning",
    ],
    postedAt: "2026-10-12",
    isFeatured: false,
  },
];

export function getAllMockJobs(): Job[] {
  return [...mockJobs];
}

export async function getJobs(
  filters: JobFilters = {},
): Promise<JobSearchResult> {
  const query = filters.query?.trim().toLowerCase();
  const filtered = mockJobs.filter((job) => {
    const searchableText = [
      job.title,
      job.employer.name,
      job.summary,
      job.category,
      job.city,
      job.state,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchableText.includes(query)) &&
      (!filters.state ||
        (filters.state.toLowerCase() === "remote"
          ? job.isRemote
          : job.state.toLowerCase() === filters.state.toLowerCase())) &&
      (!filters.remote || job.isRemote) &&
      (!filters.type || job.type === filters.type) &&
      (!filters.level || job.level === filters.level) &&
      (!filters.category ||
        job.category.toLowerCase() === filters.category.toLowerCase()) &&
      (!filters.minSalary ||
        (job.salaryMax !== undefined && job.salaryMax >= filters.minSalary)) &&
      (!filters.maxSalary ||
        (job.salaryMin !== undefined && job.salaryMin <= filters.maxSalary))
    );
  });

  if (filters.sort === "salary") {
    filtered.sort(
      (first, second) => (second.salaryMax ?? 0) - (first.salaryMax ?? 0),
    );
  } else {
    filtered.sort((first, second) =>
      second.postedAt.localeCompare(first.postedAt),
    );
  }

  const pageSize = Math.max(1, filters.pageSize ?? 6);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    jobs: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getFeaturedJobs(limit = 3): Promise<Job[]> {
  return mockJobs.filter((job) => job.isFeatured).slice(0, limit);
}

export async function getJob(slug: string): Promise<Job | null> {
  return mockJobs.find((job) => job.slug === slug) ?? null;
}
