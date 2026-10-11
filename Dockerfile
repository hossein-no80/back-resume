# ========================================
# Stage 1: Build
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# نصب pnpm
RUN npm install -g pnpm

# کپی فایل‌های package
COPY package.json pnpm-lock.yaml ./

# نصب dependencies
RUN pnpm install --frozen-lockfile

# کپی سورس کد
COPY . .

# Build پروژه
RUN pnpm run build

# ========================================
# Stage 2: Development
# ========================================
FROM node:20-alpine AS development

WORKDIR /app

RUN npm install -g pnpm

# کپی package.json و نصب dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# کپی سورس کد
COPY . .

# نصب nodemon برای توسعه
RUN pnpm add -D nodemon

# ========================================
# Stage 3: Production
# ========================================
FROM node:20-alpine AS production

WORKDIR /app

# نصب pnpm
RUN npm install -g pnpm

# کپی package.json و نصب فقط dependencies تولید
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# کپی فایل‌های build شده
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/i18n ./dist/i18n
COPY --from=builder /app/src/templates ./dist/templates

# ایجاد کاربر غیر root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# تغییر ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

# اجرای اپلیکیشن
CMD ["node", "dist/main"]