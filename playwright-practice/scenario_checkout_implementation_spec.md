# 実装指示書: SCENARIO-001（商品ソート〜カート操作〜チェックアウト〜ログアウト）

## 前提・参照

- 対象リポジトリ: `AI_Practice-01/playwright-practice/`
- テストケース: `scenario_checkout_testcase.xlsx`（シート「シナリオテスト」No.1〜12、「レビュー指摘」シート参照）
- 既存の実装済み資産（変更しないこと）:
  - `page/LoginPage.ts`
  - `page/InventoryPage.ts`（拡張が必要。下記参照）
  - `Fixtures/fixtures.ts`（`loggedInPage` フィクスチャあり）
- コーディング規約:
  - `base.extend()` を使う場合は必ず `type MyFixtures = {...}` を明示し、`base.extend<MyFixtures>(...)` の形にすること（型引数省略による推論エラーの再発防止）
  - ロケーターは `getByRole` を第一優先とし、やむを得ない場合のみ `data-test` 属性（saucedemoは `testIdAttribute: 'data-test'` 設定済み）を使う
  - アサーションは Web First Assertion（`expect(locator).toXxx()`）を使い、素の`page`に対する即時判定は避ける

## 今回のスコープ外（対応不要）

- 自己修復（self-healing）ロジックの実装
- エッジケース・バリエーションテストの追加
- CIワークフローへの本テストの追加は次工程（本指示書の対象外）

---

## 1. 新規作成するPOM

### `page/ProductDetailPage.ts`

商品詳細画面を表すクラス。

- `productName(): Locator` — 商品名見出しの要素を返す
- `addToCartButton(): Locator` — 「Add to cart」ボタン
- `backToProductsButton(): Locator` — 「Back to products」ボタン
- `addToCart(): Promise<void>` — Add to cartをクリック
- `backToProducts(): Promise<InventoryPage>` — クリックして`InventoryPage`インスタンスを返す

### `page/NavigationMenu.ts`（独立POM、全画面共通）

ハンバーガーメニュー（画面左上、三本線アイコン）を表すクラス。InventoryPage・CartPage・Checkout系ページなど、複数の画面から共通で呼び出される想定。

- コンストラクタで `page: Page` を受け取る（他のPOMのように特定画面に紐づかない）
- `open(): Promise<void>` — 三本線アイコン（`getByRole('button', { name: 'Open Menu' })` 相当。実機のアクセシブルネームをDevToolsで確認して確定すること）をクリックしてメニューを開く
- `logout(): Promise<LoginPage>` — メニュー内の「Logout」リンクをクリックし、`LoginPage`インスタンスを返す

**設計意図**: ハンバーガーメニューは特定の画面の一部ではなく、複数画面から呼ばれる共通コンポーネントのため独立クラスとする。各POM（InventoryPage等）から `new NavigationMenu(this.page)` のようにインスタンス化して使う想定。

---

## 2. 拡張する既存POM

### `page/InventoryPage.ts`

以下のメソッドを追加する。

- `sortBy(option: string): Promise<void>` — ソートドロップダウン（`getByRole('combobox')` 相当）で指定オプション（例: `'Price (low to high)'`）を選択する
- `getSortedOption(): Promise<string>` — 現在選択されているソートオプションの表示値を返す（リセット確認用）
- `clickProduct(productName: string): Promise<ProductDetailPage>` — 商品名リンクをクリックし`ProductDetailPage`を返す
- `addToCartByName(productName: string): Promise<void>` — 一覧上の特定商品の「Add to cart」ボタンをクリック（複数商品が並ぶため、`locator('.inventory_item', { hasText: productName })` のように商品単位でスコープを絞ってから操作すること。Day3で確認した strict mode violation 対策と同じ考え方）
- `removeFromCartByName(productName: string): Promise<void>` — 一覧上の特定商品の「Remove」ボタンをクリック（同様にスコープを絞る）
- `getCartBadgeCount(): Promise<string>` — カートアイコンのバッジ数値を返す（バッジが無い＝0件の場合は空文字を返す想定で実装し、呼び出し側で判定する）
- `getHeading(): Locator` — 「Products」見出し要素を返す

### `page/CartPage.ts`（未実装の場合は新規、存在する場合は拡張）

- `getCartItemNames(): Promise<string[]>` — カート内の商品名一覧を返す
- `proceedToCheckout(): Promise<CheckoutStepOnePage>` — 「Checkout」ボタンをクリック

### `page/CheckoutStepOnePage.ts`

- `fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void>` — First Name / Last Name / Zip/Postal Codeを入力
- `continue(): Promise<CheckoutStepTwoPage>` — 「Continue」をクリック

### `page/CheckoutStepTwoPage.ts`

- `finish(): Promise<CheckoutCompletePage>` — 「Finish」をクリック
- 既存に無ければ `CheckoutCompletePage.ts` も同様に新規作成し、完了メッセージ（「Thank you for your order!」または画面見出し「Checkout: Complete!」）を検証するメソッドを用意する

---

## 3. テストファイル

### `tests/scenario-001.spec.ts`（新規）

- テストケースのシナリオIDに合わせ、テスト名は `'SCENARIO-001: 商品ソート〜カート操作〜チェックアウト〜ログアウト'`
- **`loggedInPage` フィクスチャは使わないこと**。手順1（ログイン）自体がこのシナリオの検証対象のため、素の `page` フィクスチャから開始し、`LoginPage` を使って明示的にログイン処理を行う（`LOGIN-001` と同じ考え方）
- 各手順は `test.step()` で分割し、テストケースのNo.1〜12と1対1で対応させる（失敗時にHTMLレポート・Trace Viewerでどのステップで落ちたか一目で分かるようにするため）
- テストケース上の各「期待結果」列の文言を、そのまま`expect`のアサーションに落とし込む

### 実装イメージ（骨子。詳細な引数・型は既存コードのスタイルに合わせて実装すること）

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';

test('SCENARIO-001: 商品ソート〜カート操作〜チェックアウト〜ログアウト', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('1. ログイン', async () => {
    await loginPage.goto();
    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  await test.step('2. ソート変更(Price low to high)', async () => {
    // ...
  });

  // 以下、No.3〜12まで同様にstep化
});
```

### No.6（要検証事項: ソート順のリセット確認）の扱い

このステップは「期待結果が未確定の検証項目」（レビュー指摘シートNo.1参照）。実装時は以下のいずれかを選択し、コメントで理由を残すこと。

- **A案**: 期待結果を仮に「リセットされる（Name A to Zに戻る）」として実装し、実行結果で仕様の実態を確認する
- **B案**: `getSortedOption()` の戻り値を一旦ログ出力するだけにして、アサーションを保留する（`test.step` 内で `console.log` のみ）

コウさんの過去のスタイル（わざと間違った期待値を入れて検証がちゃんと機能しているか確認する習慣）を踏まえると、**A案で一旦実装し、実行結果を見てから期待値を確定させる**方が今回のPoCの目的（「動作未確認事項を実機で確定させる」）に合うと思われます。

---

## 4. 実行・確認方法

実装後、以下を確認する。

```bash
npx playwright test tests/scenario-001.spec.ts
```

- 全ステップがPASSすること
- No.6が失敗した場合は「ソート順がリセットされない仕様だった」という発見そのものが成果なので、実際の挙動に合わせて期待結果を修正し、`scenario_checkout_testcase.xlsx` の実施結果・実施備考列、および必要であれば `domain_saucedemo.md`（画面遷移構造・未確認事項セクション）に反映する

---

## 5. このあとの工程（本指示書の対象外・別途実施）

- 本テストを `.github/workflows/playwright.yml` のCI実行対象に含める（既存のワークフローで自動的にカバーされるはずだが、実行後にActionsタブで確認すること）
- `scenario_checkout_testcase.xlsx` の実施結果列・実施備考列を、実行結果に基づいて埋める
