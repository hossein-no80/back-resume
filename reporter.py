import os
import sys


def collect_project_code(
    root_dir="app",
    output_filename="project_code_dump.txt",
    exclude_dirs=[".git", "__pycache__", "venv", "node_modules"],
    exclude_extensions=[
        ".pyc",
        ".pyo",
        ".so",
        ".o",
        ".a",
        ".dll",
        ".exe",
        ".jpg",
        ".png",
        ".gif",
        ".pdf",
        ".zip",
        ".tar",
        ".gz",
        ".env",
    ],
    exclude_filenames=["Thumbs.db", ".DS_Store", "desktop.ini", "index.html"],
    exclude_patterns=None,
):
    """
    همه فایل‌ها را در یک پوشه جمع‌آوری کرده و محتوای آنها را
    با ذکر مسیر، در یک فایل خروجی ذخیره می‌کند.

    Args:
        root_dir (str): مسیر پوشه اصلی برای جستجو. (پیش‌فرض: پوشه جاری)
        output_filename (str): نام فایل خروجی متنی.
        exclude_dirs (list): لیست نام پوشه‌هایی که باید نادیده گرفته شوند.
        exclude_extensions (list): لیست پسوند فایل‌هایی که باید نادیده گرفته شوند.
        exclude_filenames (list): لیست نام فایل‌های خاص که باید نادیده گرفته شوند.
        exclude_patterns (list): لیست الگوهای مسیر (رشته) که اگر در مسیر فایل باشند، نادیده گرفته می‌شوند.
    """
    print(root_dir)
    # اطمینان از اینکه فایل خروجی، توسط خود اسکریپت پردازش نشود
    if output_filename in os.listdir(root_dir):
        print(f"⚠️ اخطار: فایل خروجی ({output_filename}) را نادیده می‌گیریم.")

    try:
        with open(output_filename, "w", encoding="utf-8") as outfile:
            for dirpath, dirnames, filenames in os.walk(root_dir):
                # نادیده گرفتن پوشه‌های مشخص شده (باید پوشه‌های پروژه باشند نه ساب‌دایرکتوری)
                dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

                for filename in filenames:
                    file_path = os.path.join(dirpath, filename)

                    # 1️⃣ نادیده گرفتن فایل خروجی و فایل خود اسکریپت
                    if file_path == output_filename or file_path == sys.argv[0]:
                        continue

                    # 2️⃣ نادیده گرفتن بر اساس نام فایل
                    if filename in exclude_filenames:
                        continue

                    # 3️⃣ نادیده گرفتن بر اساس پسوند فایل
                    file_ext = os.path.splitext(filename)[1].lower()
                    if file_ext in exclude_extensions:
                        continue

                    # 4️⃣ نادیده گرفتن بر اساس الگوهای مسیر
                    if exclude_patterns:
                        skip_file = False
                        for pattern in exclude_patterns:
                            if pattern in file_path:
                                skip_file = True
                                break
                        if skip_file:
                            continue

                    # از آنجایی که "." در مسیر وجود دارد، می‌توانیم آن را برای نمایش بهتر حذف کنیم.
                    display_path = file_path.lstrip("./")

                    try:
                        # تلاش برای باز کردن و خواندن فایل به عنوان متن
                        with open(file_path, "r", encoding="utf-8") as infile:
                            content = infile.read()

                        # ذخیره کردن مسیر و محتوا در فایل خروجی
                        outfile.write("=" * 60 + "\n")
                        outfile.write(f"📂 File Path: {display_path}\n")
                        outfile.write("=" * 60 + "\n\n")
                        outfile.write(content)
                        outfile.write("\n\n")

                        print(f"✅ پردازش شد: {display_path}")

                    except UnicodeDecodeError:
                        # اگر فایل کد نبود و فایل باینری بود (مانند عکس، زیپ و...)
                        outfile.write(
                            f"❌ خطای دیکدینگ: محتوای فایل باینری یا متنی غیر UTF-8 نادیده گرفته شد: {display_path}\n\n"
                        )
                        print(f"❌ نادیده گرفته شد (باینری/غیر UTF-8): {display_path}")
                    except Exception as e:
                        print(f"❌ خطای ناشناخته در پردازش فایل {display_path}: {e}")

        print("\n" + "#" * 70)
        print(
            f"🌟 عملیات با موفقیت به پایان رسید. فایل خروجی در: {os.path.abspath(output_filename)}"
        )
        print("#" * 70)

    except Exception as e:
        print(f"\nخطای کلی در اجرای اسکریپت: {e}")


if __name__ == "__main__":
    # مثال‌هایی از نحوه استفاده:

    # حالت 1: استفاده از تنظیمات پیش‌فرض
    # collect_project_code()

    # حالت 2: سفارشی‌سازی کامل
    collect_project_code(
        root_dir=".",
        output_filename="project_code_dump.txt",
        exclude_dirs=[
            ".git",
            "__pycache__",
            "venv",
            "node_modules",
            ".vscode",
            "docker",
            ".venv",
            ".next",
            "logos",
            "public",
            "assets",
            ".idea",
            "skeletons",
            "test",
            "types",
        ],
        exclude_extensions=[
            ".pyc",
            ".pyo",
            ".so",
            ".o",
            ".a",
            ".dll",
            ".exe",
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".bmp",
            ".ico",
            ".pdf",
            ".zip",
            ".tar",
            ".gz",
            ".rar",
            ".7z",
            ".mp3",
            ".mp4",
            ".avi",
            ".mov",
            ".exe",
            ".msi",
            ".dmg",
            # ".js",
        ],
        exclude_filenames=[
            ".DS_Store",
            ".env",
            ".gitignore",
            ".python-version",
            "desktop.ini",
            "docker-compose.prod.yml",
            "Dockerfile",
            "README.md",
            "package-lock.json",
            "project_code_dump.txt",
            "pyproject.toml",
            "reporter.py",
            "Thumbs.db",
            "sample-report.json",
            "uv.lock",
            "next-env.d.ts",
            
        ],
        exclude_patterns=["/test/", "/tests/", "/temp/", "/tmp/"],
    )
