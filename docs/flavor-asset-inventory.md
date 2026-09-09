# Pilot flavor asset inventory and import mapping

Verified 2026-09-08. Metadata-only investigation; no downloads, image inspection, PSB opening, Shopify writes, or publishing. Role choices below are provisional filename-based selections, not approval of artwork or facts.

## Access and capability

- Composio Drive: two ACTIVE accounts; pilot assets found with account alias `googledrive_aphony-throu` (Mandip). Other account returned no matching flavor folders.
- Composio Shopify: no ACTIVE connection; list operation returned no accounts. No Shopify toolkit operations executed.
- Shopify CLI 4.7.1 installed. `store execute` supports Admin GraphQL queries and mutations (mutations disabled unless --allow-mutations); requires separate stored app authorization.
- `theme info`: store b5895f-96.myshopify.com; development theme 158055432330. `store auth list --json`: sessions=[]; no directly authenticated stores. Theme configuration does not establish Admin API access.

## Scope and source sets

[LISTING](https://drive.google.com/drive/folders/1-UeD0JRUAb3u_20z1lONzwEQVkkU8Kcv) contains supplement-facts and supporting listing exports. [MOCKUPS](https://drive.google.com/drive/folders/11ExJ19dIQ46S_cs6n8lsyqDK0v_86mdm) contains front/left/right and composite jar exports.

All 10 immediate pilot folders fully listed; no pagination tokens returned. Nested 2025, 2026, TIKTOK and A+ folders were recorded but not traversed. This is not a recursive inventory or proof that root-level assets are current. Strawberry AMZ remains deferred.

## Proposed import mapping

For each flavor, select the unqualified FRONT.png as provisional hero and picker image; LEFT.png, RIGHT.png, then unqualified 3 In 1.jpg as ordered gallery candidates. Use LISTING/Supp Facts.jpg as provisional nutrition-label candidate. Blueberry and Mango also have Supp Facts_A.jpg: hold nutrition selection until reconciled. Hold every selected item for visual/content approval before upload.

- Product media: attach approved images to the existing Sea Moss product; hero becomes featured image for the exact matching flavor variant. Put exact flavor names in exported filenames and alt text so current gallery filtering works. Do not infer variant IDs, price, SKU, inventory or missing variants.
- Proposed profile: one seamoss_flavor metaobject per flavor, variant seamoss.flavor_profile of type metaobject_reference points to its returned GID. Gallery is an ordered list.file_reference of uploaded Shopify image GIDs; nutrition label, picker image and future approved wrap label are file_reference values. Drive IDs and sharing URLs are inventory provenance, not Shopify file references.
- Ingredients, nutrition facts, short description, tastes-like and serving ideas need approved flavor-specific text. Do not derive facts from filenames or copy Banana data. Leave approved wrap label empty until a continuous texture is supplied and validated; front/left/right images are not automatically a wrap.
- Exact metaobject field keys/definitions must be confirmed before import. Proposed profile rendering is not implemented in the currently inspected theme; see [flavor content guide](flavor-content-guide.md). Current variant reads are seamoss.flavor_tagline, seamoss.flavor_badge, seamoss.tastes_like; theme blocks take precedence.

## Blockers and conflicting versions

- Live product ID, variant IDs/existence, current media, metafield definitions and granted Admin scopes are unverified because Admin authentication is absent. No flavor is asserted missing from Shopify.
- All five have FRONT/LEFT/RIGHT/composite exports and nutrition candidates in the inspected roots. No approved continuous wrap or approved textual profile was established.
- Banana LEFT vs RIGHT: the companion guide reports Banana Juice/Brooklyn versus Banana Puree/Broadway. This investigation did not independently inspect those pixels. Hold both and nutrition claims for source approval.
- Blueberry: Supp Facts.jpg versus Supp Facts_A.jpg have different checksums. Four AMZ composite exports share checksum adc901eaf1a8c05829cdd869529d56db; import at most one if AMZ is chosen. The unqualified composite differs; do not silently mix versions.
- Mango: FRONT B and 3 In 1 B differ from unqualified versions; Supp Facts_A also differs. Unqualified files are mapping candidates only, not confirmed latest.
- Pineapple: FRONT_BLANK and 3 In 1_BLANK differ from standard versions; excluded from selected gallery.
- 2026 subfolders exist under LISTING/Mango, Pineapple and Watermelon; their uninspected contents may supersede root exports. 2025 folders exist for all pilots in both source sets.
- Generic IMG_3 / IMG_5_FINAL exports remain unclassified supporting images until visual review. PSD files are source-only and excluded from imports.

## Safe later execution

1. Authenticate the intended store using store auth with the required read/write products, files and metaobjects scopes, after scope/definition review. Do not print tokens or use verbose logging. Begin with read-only product/variant/definition queries.
2. Resolve source conflicts and nested-version folders; preview only raster exports. Build a reviewed manifest keyed by Drive ID + checksum, flavor, role and version.
3. Download approved exports through authenticated Drive access. Use Shopify stagedUploadsCreate, upload bytes to returned staged targets, then fileCreate; wait for successful processing. A private Drive sharing page is not a usable originalSource. Do not change Drive sharing permissions.
4. Associate resulting media with the existing product and selected variants; populate metaobjects and variant references using returned Shopify GIDs. Check GraphQL/userErrors and reread results. Keep source checksum-to-Shopify-ID mappings for idempotent reruns; preserve existing merchant edits.
5. Profile-driven rendering needs its own theme implementation and preview validation. Theme push alone does not import product media, variants or content records.

References: [Shopify staged uploads](https://shopify.dev/docs/api/admin-graphql/latest/mutations/stagedUploadsCreate), [file creation](https://shopify.dev/docs/api/admin-graphql/2026-01/mutations/fileCreate), [product media](https://shopify.dev/docs/apps/build/product-merchandising/products-and-collections/manage-media).

## Concrete file inventory

### Banana / LISTING

[Folder 100dpxD_nwQVfz63ryqy4czgUuCRxrLth](https://drive.google.com/drive/folders/100dpxD_nwQVfz63ryqy4czgUuCRxrLth)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `11ENFJeF58EyOGjnwfCqIqUJGn325O-9Z` | Nested folder; not inventoried | — | — |
| Supp Facts.jpg | `1MFTkMrdDTZ846KdC_cna24T-gzXqyn1_` | Nutrition candidate; approval required | 1446096 | 915471593b08f6572049ff419d32d91c |
| Supp Facts.psd | `1NyIgt_CpxBHBdTyFJuWRJLGdmLVWc4Tm` | Source-only; exclude | 16799764 | 12c0b10ec5c8016e0c30b4b4bc31df86 |

### Banana / MOCKUPS

[Folder 12TySS8mZP2u4PkjUDQc0rIYpeetroxQd](https://drive.google.com/drive/folders/12TySS8mZP2u4PkjUDQc0rIYpeetroxQd)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `13S7Dxk1mjT9RuF28Ixl3W3f-dtR4Gu9p` | Nested folder; not inventoried | — | — |
| TIKTOK | `13Rmkmd01XNKA0D7EHV_tVGNYDQdwgg1S` | Nested folder; not inventoried | — | — |
| SEA MOSS GEL - BANANA 16 OZ - RIGHT.png | `1bk24Jy5PV-fSDSW4V0TqEl--0Z9TPwPo` | Selected candidate: gallery 3 | 1581307 | 61620bc02f1a8f39de782275e9536d03 |
| SEA MOSS GEL - BANANA 16 OZ - RIGHT.psd | `1bzfD1FkMKpoRaK7HrjF9_LBX5dPflpKR` | Source-only; exclude | 79545780 | 997b973c50a9ecd652376d83254257ce |
| SEA MOSS GEL - BANANA 16 OZ - 3 In 1.jpg | `1b-tVAq-xQPYPzSC-XEVDIQVNn7HBh7nl` | Selected candidate: gallery 4 | 515003 | 25ef5c338ff937aac716c373f3c4e80c |
| SEA MOSS GEL - BANANA 16 OZ - 3 In 1.psd | `1bsIhC-qhrjuQN1d4t-E17qxPxGNIIgz6` | Source-only; exclude | 7567877 | 9331663fd8f81570ad2a9766c1fc2340 |
| SEA MOSS GEL - BANANA 16 OZ - LEFT.png | `1bkh4QbjZTSYBqjeqyf2MBwBDwIzQVTHF` | Selected candidate: gallery 2 | 1080228 | 322f95767b9c4469a5164aa072c6bb49 |
| SEA MOSS GEL - BANANA 16 OZ - FRONT.png | `1brMFm3j4q1g4LgrBX0zZRhervOFMyxY0` | Selected candidate: hero / picker / gallery 1 | 782999 | 423632d474ca19871e946c7618b233c8 |
| SEA MOSS GEL - BANANA 16 OZ - LEFT.psd | `1bxwjBQTrV01x1aACF7J6mPl0jx5CI5qH` | Source-only; exclude | 87171854 | 6b9aab0ede87da396cf540f4681f3bee |
| SEA MOSS GEL - BANANA 16 OZ - FRONT.psd | `1buJsXwXjyD22Y7qa5D_s-MZnB06c9_mJ` | Source-only; exclude | 78477982 | 65a0df5bc6aa4adc6142ec11f8bb8294 |

### Blueberry / LISTING

[Folder 1-uh3Q5Kkx-6T0DnY_gAI0_GvdnSbeGq5](https://drive.google.com/drive/folders/1-uh3Q5Kkx-6T0DnY_gAI0_GvdnSbeGq5)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `10pnJ-ipX88CLv713N7SdeOs8krJ2D4eI` | Nested folder; not inventoried | — | — |
| Supp Facts_A.jpg | `1Ob6MbpcYcjc7KwMdSx38UbMLVsn514wo` | Nutrition candidate; approval required | 1724958 | e0ff0373cd8a073bf746911887906635 |
| Supp Facts_A.psd | `1QEdRFvgsFhdt1iyy-9c4zr-RzaG3tg3R` | Source-only; exclude | 17655661 | c1ad8aca232a559470c51156f2781038 |
| Supp Facts.jpg | `1Od7qfatn0TqfPsYcAT7GSirRTYYGVshG` | Nutrition candidate; approval required | 1447303 | 295e06765ddeff70206afc9680e3b4c2 |
| Supp Facts.psd | `1QCopFD0npT1Ch7_-IPct9fx8LMFJJlYZ` | Source-only; exclude | 16801846 | 2b25baeb5e9e80a8b1d7ac34ce0f144e |
| IMG_5_FINAL.jpg | `1OdLLGWvuQq6OlyHrKpQVuAc6w3Nu5Z7Q` | Supporting candidate; visual review needed | 912590 | d1654aea0307ca43ddb04183afe3fcf0 |
| IMG_5_FINAL.psd | `1Q1BRofGk-otCCKsA3sipfC2bIYToQVve` | Source-only; exclude | 10945079 | d38de84183982ed816570377515a65fa |
| IMG_3.jpg | `1OgrRZJz_1fiic7GKdm9YNM5uDXhMovFn` | Supporting candidate; visual review needed | 2408836 | d7a3924326798b43192d43a1b709c11b |
| IMG_3.psd | `1Pi1QRGj1UNtYzZrLVjuQBoKmbR4qxQTa` | Source-only; exclude | 81059936 | 565ce8399110c65a224c8a94196f0c9e |

### Blueberry / MOCKUPS

[Folder 12ORZ_lGfSmZEo_eABkh6nb23G4baVuAV](https://drive.google.com/drive/folders/12ORZ_lGfSmZEo_eABkh6nb23G4baVuAV)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `13R4EZiLTvoZ7YjebtYVBoZHYN43Qd7PE` | Nested folder; not inventoried | — | — |
| TIKTOK | `13NDpd_LVS0lfmJLmGyvf5q0LXdbrwLGD` | Nested folder; not inventoried | — | — |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1 [AMZ]@1x_1-1.jpg | `1cyC6iKpQqIzRQFLTg1clRTPOBf1_LA-4` | Alternate version; hold | 540260 | adc901eaf1a8c05829cdd869529d56db |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1 [AMZ].jpg | `1d11oPGPbQjiE3K-BMrxWfZzNZ3aOj9m2` | Alternate version; hold | 540260 | adc901eaf1a8c05829cdd869529d56db |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1 [AMZ]@1x_1.jpg | `1dOapslmXs-zgktwR4eSbMaZ8et6mCudu` | Alternate version; hold | 540260 | adc901eaf1a8c05829cdd869529d56db |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1 [AMZ]-1.jpg | `1d857odCNKriTRrk50QvGOuwFAkjfCrvY` | Alternate version; hold | 540260 | adc901eaf1a8c05829cdd869529d56db |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1 [AMZ].psd | `1dfFnB5OdGA_f2y3TLmuqJeTU0fG-ydtg` | Source-only; exclude | 7386454 | becf6347a31bedbc229a34e3bc1b1c3a |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1 B.psd | `1dCzVal9sx48VjrScDOZbZ13mgE8A9tzE` | Source-only; exclude | 7386571 | 528550296670be49dd5bd8f5f5a32edb |
| SEA MOSS GEL - BLUEBERRY 16 OZ - FRONT.png | `1dNUmz3X7MCIp4m-HheOxEx9XG3v1hiZz` | Selected candidate: hero / picker / gallery 1 | 1260243 | 62125cff6567fa8bef8a1c0140339ace |
| SEA MOSS GEL - BLUEBERRY 16 OZ - FRONT.psd | `1e646F6KV51VU3_qcSAgra6qsiKH1RP9E` | Source-only; exclude | 76653472 | a91d7963a27c5dd86493eb49984046a7 |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1.jpg | `1dNodjKg0XxJB7TuwyCBuNT0dAQoPk_av` | Selected candidate: gallery 4 | 553292 | 5269834be1ac353c3c7da6a3de8cbdea |
| SEA MOSS GEL - BLUEBERRY 16 OZ - 3 In 1.psd | `1e2VQN1XEyJy8o8U1JZLsItixDXwBhhRj` | Source-only; exclude | 7451442 | 877288180721b4d887b1842b760149d6 |
| SEA MOSS GEL - BLUEBERRY 16 OZ - RIGHT.png | `1e-wf2XG4YD_RP8WfbigimFhE_Zc66Nd3` | Selected candidate: gallery 3 | 1194274 | c2a1439d60346b58c08001f7056893c6 |
| SEA MOSS GEL - BLUEBERRY 16 OZ - LEFT.png | `1dJqi1XjGpc7AL7StoNPBE511dR8NnR52` | Selected candidate: gallery 2 | 1073979 | cb330230dbc4661292ad9fe2303dc462 |
| SEA MOSS GEL - BLUEBERRY 16 OZ - LEFT.psd | `1e6LWbhuAkuu1NRYER6FsNZiWERn2OQcK` | Source-only; exclude | 83399604 | 6101934c1319f4d6eae64789c4c06244 |
| SEA MOSS GEL - BLUEBERRY 16 OZ - RIGHT.psd | `1e7CKzTvQ298h2BVARLFi8bWOUp5_s3bR` | Source-only; exclude | 77802382 | c8371836f316228086a628d7344c13ee |

### Mango / LISTING

[Folder 10YCTohbGq7H-0aTOp0YEy4Obj1oth_1V](https://drive.google.com/drive/folders/10YCTohbGq7H-0aTOp0YEy4Obj1oth_1V)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2026 | `16VH13r8Bu-lug_XFsnF-Hub76aBLHLK_` | Nested folder; not inventoried | — | — |
| 2025 | `120TE_pc4Eihlvl9TMeGXuZctF2grxZrT` | Nested folder; not inventoried | — | — |
| A+ | `120Ksv6PrMe51yOwde884R4qKckqmkS8Z` | Nested folder; not inventoried | — | — |
| Supp Facts_A.jpg | `1TBDSwpDl90nZ7g9vvGVCpwQm2gQsH45q` | Nutrition candidate; approval required | 1723717 | b0c0e2cf13881a1e40d0b787a2640f65 |
| Supp Facts_A.psd | `1Tuqdng077A_a96Mg1vYfsYguiFO0DbqE` | Source-only; exclude | 17653134 | 13bccd0a6b86681471b7dc6e92a91dd4 |
| Supp Facts.jpg | `1TC-GEYmOoIKCIvF9AMEro50ociOxQDYZ` | Nutrition candidate; approval required | 1446185 | 9f9e3d5377f5e3f1af824fcbb56a0dcb |
| Supp Facts.psd | `1Tco1VXFesuAzrPBJh8JJX3cWoEeNntVU` | Source-only; exclude | 16799660 | 5adcfbbbc72d155fdde20d8212bd9ea7 |
| IMG_3.jpg | `1TLmvpu8g4kHyMnFvtC7lJWhR1hEpyKUQ` | Supporting candidate; visual review needed | 2427830 | 1b9a76d06a86f0654b00d3db7b2e9e03 |
| IMG_3.psd | `1TONhWSlyQELoAp5yJSoOw3pjb0MBlR0z` | Source-only; exclude | 83320065 | 52c898f53376e3841acd68f9d04336c3 |
| IMG_5_FINAL.jpg | `1RTCoziApkYZ7jyVqFyUJd0qF1Sc3WGDz` | Supporting candidate; visual review needed | 1009966 | 5accd3302571ae39dea59366a4e7e833 |
| IMG_5_FINAL.psd | `1T_SMkm3NpN8AZ7LHJbQNA7xDyfcqj7QE` | Source-only; exclude | 20988483 | d4424199a8fdf25873a82a8b9399fa2c |

### Mango / MOCKUPS

[Folder 137X4iIBrk_LZHx_PslZnBZ9yZnSSIIcx](https://drive.google.com/drive/folders/137X4iIBrk_LZHx_PslZnBZ9yZnSSIIcx)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `1om1uh6YQJzxT25gPCoT_snX_OrWab-5W` | Nested folder; not inventoried | — | — |
| TIKTOK | `148a17VfExB0htGwktt93ENbEC1QR7Xto` | Nested folder; not inventoried | — | — |
| SEA MOSS GEL - MANGO 16 OZ - 3 In 1 B.jpg | `1iXhbsHtfBvLPbM7WqIJZIIOImD-EdRrq` | Alternate version; hold | 516847 | d0c0c35925a27a03bb2ac9231ec1f861 |
| SEA MOSS GEL - MANGO 16 OZ - 3 In 1 B.psd | `1j62sQf2VrhAJfdq_W7hBLiZY1kYjUab9` | Source-only; exclude | 7668813 | 7bb3cbdaad89e77b66ef0601153b0321 |
| SEA MOSS GEL - MANGO 16 OZ - FRONT B.png | `1j4DtQIuiWxvAVf3ViDKVqW3Cca6d98Sy` | Alternate version; hold | 1193441 | 343f334b9817c62cbc2f4b211d772851 |
| SEA MOSS GEL - MANGO 16 OZ - FRONT B.psd | `1jMxJZ_FAxc7xEJeRLTGiaZnpZBq2QzXn` | Source-only; exclude | 78666088 | 67826b8474613dfffd5e4f97b5ec4099 |
| SEA MOSS GEL - MANGO 16 OZ - LEFT.png | `1ivtK0idXmgqMx9Lr1Fq6oNXqc-3CBNuq` | Selected candidate: gallery 2 | 1106951 | a0dc2794785d32d161f9b376215c9dfe |
| SEA MOSS GEL - MANGO 16 OZ - 3 In 1.jpg | `1j5WhYkHsA5qjdgvxcT7eAFa5cOn7zvRo` | Selected candidate: gallery 4 | 534209 | b4aff357c4071a6f4ea52ab4e59f24e6 |
| SEA MOSS GEL - MANGO 16 OZ - 3 In 1.psd | `1jIwsZnEzBhgjv_Aap2UWRjLdcvm2l4wl` | Source-only; exclude | 6449307 | c44f24c01909744ad41170ca2feaa10e |
| SEA MOSS GEL - MANGO 16 OZ - RIGHT.png | `1jEp4j22iiJp_plVVTyQXVdlsAxOsDrAt` | Selected candidate: gallery 3 | 1298201 | b4819ad5a5a8fbcf2f316a4ce807e58e |
| SEA MOSS GEL - MANGO 16 OZ - RIGHT.psd | `1jYqd-gO1iB8ZheIEBnUDzKRKry64sMRI` | Source-only; exclude | 80266384 | cb26e095d7ef1da71ac8cc4ee91222db |
| SEA MOSS GEL - MANGO 16 OZ - FRONT.png | `1j00kkSNcetO7zYXKeFcw6147DCOgen94` | Selected candidate: hero / picker / gallery 1 | 841886 | 5fd0f71d15594ab8a605caf340fc9c99 |
| SEA MOSS GEL - MANGO 16 OZ - LEFT.psd | `1jUs0F9_e16Bki5PldaKwA_aQK93KJrmS` | Source-only; exclude | 87529740 | 8c081b2c890ab92b965b4e14306f48dc |
| SEA MOSS GEL - MANGO 16 OZ - FRONT.psd | `1jNjRsOPKUg5puxGew1hSuHFD0f-xKSl8` | Source-only; exclude | 78728192 | 82de75c5feec2c5f21e9bcfdaba9729a |

### Pineapple / LISTING

[Folder 10QgUZlqdjJZvNDAo7dTdPdpOb7m3A2G0](https://drive.google.com/drive/folders/10QgUZlqdjJZvNDAo7dTdPdpOb7m3A2G0)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2026 | `1y8guN_0GukIX30JPZd8wmw5IADwNQ6cF` | Nested folder; not inventoried | — | — |
| 2025 | `11r3zZfcLyZME3f3rklr1K9llLw-TMrsP` | Nested folder; not inventoried | — | — |
| A+ | `11pu0NEL47kZ1jC7sBw15-wc7fkn1FI8E` | Nested folder; not inventoried | — | — |
| IMG_5_FINAL.jpg | `1UnI5l1_3iLdEQJKBkdxBFEef9vWCCBHF` | Supporting candidate; visual review needed | 823951 | 4213b659c956668b9de667aec65fdf19 |
| IMG_5_FINAL.psd | `1VRcHGAGlSmyIxPeqqZVHJ8WWNamOGw8A` | Source-only; exclude | 17214861 | 151eb560d6809c3cf8c2907c20e3f636 |
| Supp Facts.jpg | `1V2WiZIaIhztSC5dIZIIFQ9sSXWqfFFVE` | Nutrition candidate; approval required | 1726044 | 3a286d1842516c9b62efa6f2cbcfc192 |
| Supp Facts.psd | `1VUvTgiTM2-F9XdLgWOLH7us29j7YQ4lC` | Source-only; exclude | 17290423 | 234a46d2cb3fd98675c34c51ae6ab6a3 |
| IMG_3.jpg | `1VAreQO5pAOZAa6ClDV1CMsfRdnrOoVgA` | Supporting candidate; visual review needed | 2434878 | 25d0693cbb4c9bf20b34793a8ccbeb88 |
| IMG_3.psd | `1VQciCzivxXckxjD5pqeNGv68Kd7On7Yu` | Source-only; exclude | 83465014 | 2fcaa65999646807fc84b3ba31944b06 |

### Pineapple / MOCKUPS

[Folder 12xQRnxwEJ3t1mq5zKjRgQ66-6bTN9ZS4](https://drive.google.com/drive/folders/12xQRnxwEJ3t1mq5zKjRgQ66-6bTN9ZS4)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `1p4ijQ7HpMqH_o4QMMD2k698qGHmLN15a` | Nested folder; not inventoried | — | — |
| SEA MOSS GEL - PINEAPPLE 16 OZ - 3 In 1.jpg | `1kfAS5TRAJ5AuwTJcYPosxsJBz5fzGb_Q` | Selected candidate: gallery 4 | 526590 | d198658d00257313e62772e0bd8c3b94 |
| TIKTOK | `145QJ_87lXNLeD_sPfUAa2gvET2mH17Yr` | Nested folder; not inventoried | — | — |
| SEA MOSS GEL - PINEAPPLE 16 OZ - 3 In 1_BLANK.jpg | `1mesdSJt_fOvLwRU96Xl6gR9pjlr8SDng` | Alternate version; hold | 512844 | 544c4ca496ca24b425a9d6f49281b20e |
| SEA MOSS GEL - PINEAPPLE 16 OZ - 3 In 1.psd | `1liYVTVX3iWSu8o9C-0rR_zP6togpacJr` | Source-only; exclude | 5525871 | 303861c50275c500fbfe3113247eba3d |
| SEA MOSS GEL - PINEAPPLE 16 OZ - FRONT_BLANK.png | `1mGwu7n58AKudRq-Zb9D4KQfb-ftmanzZ` | Alternate version; hold | 1190282 | 6084140aa4304653be7a351a24778451 |
| SEA MOSS GEL - PINEAPPLE 16 OZ - FRONT.psd | `1moIBE08itU40xIuQr9tJ1zUmNIrVoQsz` | Source-only; exclude | 87656076 | 19195df1b5f852e5e105704c9f7e5bf6 |
| SEA MOSS GEL - PINEAPPLE 16 OZ - FRONT.png | `1mMbkqqaqMBFaSlW02j9BkSXu1wrXbKBp` | Selected candidate: hero / picker / gallery 1 | 852584 | 03356783c87de517e4f0b1871d2c3bfe |
| SEA MOSS GEL - PINEAPPLE 16 OZ - LEFT.png | `1mF0KaHDaf4c4I2uNAgYIxs41Id80qvx-` | Selected candidate: gallery 2 | 1505179 | 0ccf4fd7288fb7b342fff6f2f68dc156 |
| SEA MOSS GEL - PINEAPPLE 16 OZ - LEFT.psd | `1mpmIBaZvXhDi14sVoDrNkQQd-XKC6kQz` | Source-only; exclude | 87578238 | d0e714899c527c18ea1b3a2878b7e011 |
| SEA MOSS GEL - PINEAPPLE 16 OZ - RIGHT.png | `1m7KHx3FjNKcdpReIMoup7K5pYLiUmCMF` | Selected candidate: gallery 3 | 1632116 | 616eb0e2c20432be96a4eda36d8ef6c4 |
| SEA MOSS GEL - PINEAPPLE 16 OZ - RIGHT.psd | `1mt6c0KMMxNzQN-zS96SQrBFAJ0hUT-5i` | Source-only; exclude | 89035028 | d790f8bef9e7350ea48728a1547a2f65 |

### Watermelon / LISTING

[Folder 11UUHbNPYchG7BnVGQ0A3PKN5pD2a2Z5F](https://drive.google.com/drive/folders/11UUHbNPYchG7BnVGQ0A3PKN5pD2a2Z5F)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2026 | `1dvR-6I2-aTIyeEySHfi8BBgQvtdsAgoB` | Nested folder; not inventoried | — | — |
| 2025 | `12iVwF7R08KhtsDk9QzBqe586r052mG8K` | Nested folder; not inventoried | — | — |
| Supp Facts.jpg | `1_hTI90hug9dj1YZhHTmsXEitldcVJt_8` | Nutrition candidate; approval required | 1447963 | 1fe3c1e75a968cefad9141777f21a7dc |
| IMG_3.psd | `1_VYaP76ee-Lzywj24b5nNsGmcVov90Js` | Source-only; exclude | 84112061 | 87f0dd7318129b7236009c97fe6417ec |
| IMG_3.jpg | `1_OPhEnTXFhM5EukxUWAE7vFQFxK5WGK2` | Supporting candidate; visual review needed | 2464303 | 0e44d76251922c0a2067bc6336fa6414 |
| IMG_5_FINAL.jpg | `1_Njv3D-_l84CSyHsTEr9_vbPmn8fKEQ_` | Supporting candidate; visual review needed | 962441 | 29a10f6cc5bc11cdb41ed7a2cafd4c5a |

### Watermelon / MOCKUPS

[Folder 13WZrHx2u2297sHfB70TfU_p_DykXys0j](https://drive.google.com/drive/folders/13WZrHx2u2297sHfB70TfU_p_DykXys0j)

| Filename | Drive ID | Proposed role/status | Bytes | MD5 |
| --- | --- | --- | --- | --- |
| 2025 | `18O_qRnwVKNm0CfUigDMOxACGCt0eVjui` | Nested folder; not inventoried | — | — |
| TIKTOK | `13y27Mfs7RPrQP0OdjnYYgqvv6ZWQRWx9` | Nested folder; not inventoried | — | — |
| SEA MOSS GEL - WATERMELON 16 OZ - 3 In 1.jpg | `1s1oPdAdnu-VNTxWYPGA_RxeebWQ-MKgA` | Selected candidate: gallery 4 | 540545 | 47b7e2cc5169d2d8d1e1cd8ddc5b1d11 |
| SEA MOSS GEL - WATERMELON 16 OZ - 3 In 1.psd | `1tJ3z4D6A_6Dnph1qpXHUn2TzAFBys2pg` | Source-only; exclude | 7380175 | 9810c756427426522c86b5114f370004 |
| SEA MOSS GEL - WATERMELON 16 OZ - RIGHT.png | `1uUY8orKZhe-mWYpEP8RjngHzg-2vHqsL` | Selected candidate: gallery 3 | 1278515 | b160cc5bc849c218ca536c6e104445eb |
| SEA MOSS GEL - WATERMELON 16 OZ - LEFT.png | `1tD5epK8MQ2jA5eSFoLqOrPyWtmnLloPa` | Selected candidate: gallery 2 | 1148250 | a6031e6a315a5ae95717fd286050b700 |
| SEA MOSS GEL - WATERMELON 16 OZ - FRONT.png | `1tFo6hnxGbe1-shTy3fbI6j0gJ4BH3s2F` | Selected candidate: hero / picker / gallery 1 | 911816 | ea2729741677aedb6da5683e083b37fe |
| SEA MOSS GEL - WATERMELON 16 OZ - LEFT.psd | `1tcFPniwUr1fIewtpHRxJvqgwOtUwwZ_k` | Source-only; exclude | 87839908 | 143de2290e1f7580c63fead3e9cb5afb |
| SEA MOSS GEL - WATERMELON 16 OZ - RIGHT.psd | `1uVLKJ8PZynE6GvLs_uEhal1nY7Yi00mP` | Source-only; exclude | 80222680 | a206293590ed6e8fb81c139fb027dfd2 |
| SEA MOSS GEL - WATERMELON 16 OZ - FRONT.psd | `1tW2F72mCHV7DRti5_u81hH6JRV9J02CK` | Source-only; exclude | 79003464 | 130e9d34208a62865e10cd1036556040 |

