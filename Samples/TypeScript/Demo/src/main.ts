/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';
import * as LAppDefine from './lappdefine';
//+++
import { LAppLive2DManager } from './lapplive2dmanager';

/**
 * ブラウザロード後の処理
 */
window.onload = (): void => {
  // create the application instance
  if (LAppDelegate.getInstance().initialize() == false) {
    return;
  }

  LAppDelegate.getInstance().run();

  //+++
  // document.querySelector('.reveal').addEventListener('click', e => {
  //   const target = e.target as HTMLTextAreaElement;

  //   // console.log(target.className === 'controls-arrow');

  //   if (target.className === 'controls-arrow') {
  //     // LAppLive2DManager.getInstance().changeScene();
  //     LAppLive2DManager.getInstance().nextScene();
  //   }
  // });
};

(window as any).runModel = (callback:Function) => {
  LAppDelegate.getInstance().runModel(callback);
}

/**
 * 終了時の処理
 */
window.onbeforeunload = (): void => LAppDelegate.releaseInstance();

/**
 * Process when changing screen size.
 */
window.onresize = () => {
  if (LAppDefine.CanvasSize === 'auto') {
    LAppDelegate.getInstance().onResize();
  }
};
