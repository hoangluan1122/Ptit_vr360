# PTIT VR360

Khung co ban cho web tham quan 360 cua cac phong lab:

- Lab CTS
- Trung tam CIE
- Thu vien
- Lab Naver
- Lab Samsung
- Lab Viettel
- Lab Game

## Cach chay nhanh

Neu co Python:

```powershell
cd B:\Ptit_vr360
python -m http.server 8080
```

Mo:

```text
http://localhost:8080
```

Neu co Docker:

```powershell
cd B:\Ptit_vr360
docker compose up
```

## Them Krpano

Dat file Krpano vao:

```text
vendor/krpano/tour.js
vendor/krpano/tour.swf
vendor/krpano/skin/
```

## Them anh 360

Sau khi dung Krpano cat anh, dat tile vao:

```text
panos/lab_cts/
panos/cie_center/
panos/library/
panos/lab_naver/
panos/lab_samsung/
panos/lab_viettel/
panos/lab_game/
```

Neu duong dan tile Krpano sinh ra khac mau hien tai, sua trong `tour.xml`.

## Sua noi dung popup

Mo file:

```text
js/app.js
```

Sua `title`, `description`, `image` trong tung scene.
