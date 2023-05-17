import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const generateRandomOTP = (): number => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const otpExpiry = (createdAt: Date): boolean => {
  const otpExpiry = new Date(createdAt);
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
  const now = new Date();
  if (now > otpExpiry) return true;
  return false;
};

export async function getPaginatedData({
  model,
  page = 1,
  limit = 10,
  query = {},
  sort = { createdAt: -1 },
  populate = {},
  endPoint,
}: {
  model: any;
  page: number;
  limit: number;
  query: any;
  sort: any;
  populate: any;
  endPoint: string;
}): Promise<any> {
  const count = await model.countDocuments(query);
  const totalPages = Math.ceil(count / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const result = await model
    .find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(populate);

  const pagination = {
    currentPage: Number(page),
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalItems: count,
    nextPage: null,
    prevPage: null,
  };

  if (hasNextPage) {
    pagination.nextPage = `${process.env.BASE_URL}/api/${endPoint}?page=${
      Number(page) + 1
    }&limit=${limit}`;
  }

  if (hasPrevPage) {
    pagination.prevPage = `${process.env.BASE_URL}/api/${endPoint}?page=${
      Number(page) - 1
    }&limit=${limit}`;
  }

  return { result, pagination };
}

export const getEndPoint = (url: string): string => {
  return url.split('?')[0].split('/')[2];
};

export enum Roles {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin',
}
