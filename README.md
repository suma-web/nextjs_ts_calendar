# カレンダーを作成する
使用言語　Next.js、TypeScript
DB　なし（リロードすると予定が消えます）

### 初期セットアップ
`npx create-next-app@latest my-app --yes`
[http://localhost:3000](http://localhost:3000) でNext.jsの初期セットアップが確認できる

# アプリについて
イメージか簡易版のGoogleカレンダー

### 機能
- Auth.jsを利用し、Googleアカウント認証のログイン機能を実装
- カレンダーの表示（月、週、日表示を選択できる）
  - それとは別に月表示のカレンダーが左側にある。
- 予定の編集（追加、再編集、削除）

### 挙動紹介
1. ログイン画面（一度ログインすれば利用可能）
<img width="658" height="288" alt="スクリーンショット 2026-04-04 0 08 16" src="https://github.com/user-attachments/assets/bbfdd406-3641-446f-ab1d-66092bf54404" />

2. 認証後の画面
- 本日の日付は青丸で強調。デフォルトは月表示。
<img width="1831" height="1200" alt="スクリーンショット 2026-04-04 0 10 47 2" src="https://github.com/user-attachments/assets/8f757ebe-37a3-435b-bba9-84e709632b94" />

3. カレンダーの表示（月、週、日表示を選択できる）
<img width="748" height="399" alt="スクリーンショット 2026-04-04 0 12 18" src="https://github.com/user-attachments/assets/2c4f288e-c859-4004-82aa-7de666166993" />
- 日表示
<img width="1702" height="1232" alt="スクリーンショット 2026-04-04 0 12 35" src="https://github.com/user-attachments/assets/2aac5744-5ab6-4526-818e-b8126ab5b595" />
- 週表示
<img width="1719" height="1173" alt="スクリーンショット 2026-04-04 0 12 51" src="https://github.com/user-attachments/assets/25472cdb-f0f2-44ee-8a60-891f6f28f15f" />

4. 予定の追加
- 月、週、日表示でも予定の追加は可能。タイトルと日付、始まり時間と終わり時間を記入。
<img width="800" height="542" alt="スクリーンショット 2026-04-04 0 13 08" src="https://github.com/user-attachments/assets/357ceba1-dc26-498e-b7f6-9482a6e6188d" />
- 追加後（始まり時間と終わり時間の長さをheightに反映させ、UX向上）
<img width="1707" height="1210" alt="スクリーンショット 2026-04-04 0 14 16" src="https://github.com/user-attachments/assets/c5bda45b-53c9-45a7-83d4-2b2b0fd1d02e" />

5. 予定の再編集と削除（予定の追加をしないと表示しない）
- UX向上のため予定をクリックしたら再編集の「🖊️」と予定削除の「🗑️」を用意。
<img width="664" height="370" alt="スクリーンショット 2026-04-04 0 14 27" src="https://github.com/user-attachments/assets/42b2ad3f-5505-43a8-b934-8baeaa9db00b" />
- 再編集の「🖊️」をクリック後
<img width="269" height="202" alt="スクリーンショット 2026-04-04 0 14 35" src="https://github.com/user-attachments/assets/43eb2fba-c697-4fbb-a5d0-a9117e9fccf6" />
- 再編集後
<img width="248" height="134" alt="スクリーンショット 2026-04-04 0 14 47" src="https://github.com/user-attachments/assets/df4230be-6acf-4381-8e4d-2e8297d7cce5" />
- 削除後
<img width="1706" height="1178" alt="スクリーンショット 2026-04-04 0 15 09" src="https://github.com/user-attachments/assets/0a876865-041d-4914-b919-033f4146b069" />

