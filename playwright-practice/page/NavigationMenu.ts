import { Page, Locator } from '@playwright/test';
import { LoginPage } from './LoginPage';

/**
 * ハンバーガーメニュー（画面左上の三本線アイコン）を表す独立POM。
 *
 * 設計意図: このメニューは特定の画面の一部ではなく、Inventory / Cart / Checkout系など
 * 複数画面から共通で呼び出される共通コンポーネントのため独立クラスとする。
 * 各POMからは `new NavigationMenu(this.page)` のようにインスタンス化して使う想定。
 */
export class NavigationMenu {
  readonly page: Page;
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // DevToolsで確認した実機のアクセシブルネーム
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  /** 三本線アイコンをクリックしてメニューを開く */
  async open(): Promise<void> {
    await this.openMenuButton.click();
  }

  /** メニュー内の「Logout」リンクをクリックし、LoginPageインスタンスを返す */
  async logout(): Promise<LoginPage> {
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }
}
