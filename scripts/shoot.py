import sys, os, asyncio
from playwright.async_api import async_playwright

OUT = "/tmp/shots"
os.makedirs(OUT, exist_ok=True)


async def main():
    specs = []
    for arg in sys.argv[1:]:
        # path:scrollY:name
        parts = arg.split("::")
        specs.append((parts[0], int(parts[1]) if len(parts) > 1 else 0, parts[2] if len(parts) > 2 else parts[0].strip("/").replace("/", "-") or "home"))

    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--disable-dev-shm-usage"])
        W = int(os.environ.get("W", 1440)); H = int(os.environ.get("H", 900))
        rm = {"reduced_motion": "reduce"} if os.environ.get("REDUCED") else {}
        page = await browser.new_page(**rm, viewport={"width": W, "height": H}, device_scale_factor=1, has_touch=os.environ.get("W") is not None)
        if os.environ.get("SKIP_INTRO", "1") == "1":
            await page.add_init_script("try{sessionStorage.setItem('mb-intro','done')}catch(e){}")
        errors = []
        page.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.on("requestfailed", lambda r: errors.append(f"failed: {r.url}"))
        page.on("response", lambda r: errors.append(f"http {r.status}: {r.url}") if r.status >= 400 else None)
        for path, y, name in specs:
            await page.goto(f"http://localhost:3000{path}", wait_until="load")
            await page.wait_for_timeout(int(os.environ.get("WAIT", 3500)))
            if y:
                await page.evaluate(f"window.scrollTo(0,{y})")
                await page.wait_for_timeout(2500)
            await page.screenshot(path=f"{OUT}/{name}.png")
            print("shot", name)
        if errors:
            print("--- console ---")
            for e in errors[:25]:
                print(e)
        await browser.close()


asyncio.run(main())
