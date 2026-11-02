/* Nap tung partial (partials/*.html) vao dung vi tri cua slot <div data-include>.
   Slot duoc thay the bang chinh noi dung partial (outerHTML), nen DOM cuoi cung
   khong co div boc them - giong het cau truc body cua file goc.
   Script trong partial khi nap bang fetch/innerHTML se KHONG tu chay, nen
   loader nap xong het partial roi moi nap js/main.js.
   Luu y: mo truc tiep bang file:// se bi chan fetch (CORS). De xem thu, chay
   server cuc bo trong thu muc nay, vi du: python3 -m http.server 8000
   roi mo http://localhost:8000/ - hoac deploy len host/Cloudflare Pages. */
document.addEventListener("DOMContentLoaded", async () => {
  const slots = [...document.querySelectorAll("[data-include]")];
  for (const el of slots) {
    try {
      const r = await fetch(el.dataset.include);
      if (!r.ok) throw new Error(r.status);
      el.outerHTML = await r.text();
    } catch (e) {
      el.outerHTML = '<p style="padding:20px;color:#a00">Khong tai duoc ' + el.dataset.include + '</p>';
    }
  }
  const s = document.createElement("script");
  s.src = "js/main.js";
  document.body.appendChild(s);
});
