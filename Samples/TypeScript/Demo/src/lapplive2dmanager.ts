/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { ACubismMotion } from '@framework/motion/acubismmotion';
import { csmVector } from '@framework/type/csmvector';

import * as LAppDefine from './lappdefine';
import { canvas } from './lappdelegate';
import { LAppModel } from './lappmodel';
import { LAppPal } from './lapppal';

export let s_instance: LAppLive2DManager = null;

/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
export class LAppLive2DManager {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppLive2DManager {
    if (s_instance == null) {
      s_instance = new LAppLive2DManager();
    }

    return s_instance;
  }

  /**
   * クラスのインスタンス（シングルトン）を解放する。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance = void 0;
    }

    s_instance = null;
  }

  /**
   * 現在のシーンで保持しているモデルを返す。
   *
   * @param no モデルリストのインデックス値
   * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
   */
  public getModel(no: number): LAppModel {
    if (no < this._models.getSize()) {
      return this._models.at(no);
    }

    return null;
  }

  /**
   * 現在のシーンで保持しているすべてのモデルを解放する
   */
  public releaseAllModel(): void {
    for (let i = 0; i < this._models.getSize(); i++) {
      this._models.at(i).release();
      this._models.set(i, null);
    }

    this._models.clear();
  }

  /**
   * 画面をドラッグした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onDrag(x: number, y: number): void {
    for (let i = 0; i < this._models.getSize(); i++) {
      const model: LAppModel = this.getModel(i);

      if (model) {
        model.setDragging(x, y);
      }
    }
  }

  /**
   * 画面をタップした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onTap(x: number, y: number): void {
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(
        `[APP]tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}`
      );
    }

    for (let i = 0; i < this._models.getSize(); i++) {
      if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
        if (LAppDefine.DebugLogEnable) {
          LAppPal.printMessage(
            `[APP]hit area: [${LAppDefine.HitAreaNameHead}]`
          );
        }
        this._models.at(i).setRandomExpression();
      } else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) {
        if (LAppDefine.DebugLogEnable) {
          LAppPal.printMessage(
            `[APP]hit area: [${LAppDefine.HitAreaNameBody}]`
          );
        }
        this._models
          .at(i)
          .startRandomMotion(
            LAppDefine.MotionGroupTapBody,
            LAppDefine.PriorityNormal,
            this._finishedMotion
          );
      }
    }
  }

  /**
   * 画面を更新するときの処理
   * モデルの更新処理及び描画処理を行う
   */
  public onUpdate(): void {
    const { width, height } = canvas;

    const projection: CubismMatrix44 = new CubismMatrix44();
    const modelCount: number = this._models.getSize();

    for (let i = 0; i < modelCount; ++i) {
      const model: LAppModel = this.getModel(i);

      // 再從live2d manager to lapp model
      //綁定參數
      model.angleX = this.angleX;
      model.angleY = this.angleY;
      model.angleZ = this.angleZ;
      model.eyeLOpen = this.eyeLOpen;
      model.eyeLSmile = this.eyeLSmile;
      model.eyeROpen = this.eyeROpen;
      model.eyeRSmile = this.eyeRSmile;
      model.eyeBallX = this.eyeBallX;
      model.eyeBallY = this.eyeBallY;
      model.eyeBallForm = this.eyeBallForm;
      model.browLY = this.browLY;
      model.browRY = this.browRY;
      model.browLX = this.browLX;
      model.browRX = this.browRX;
      model.browLAngle = this.browLAngle;
      model.browRAngle = this.browRAngle;
      model.browLForm = this.browLForm;
      model.browRForm = this.browRForm;
      //mouth form
      model.mouthForm = this.mouthForm;
      //mouth openY
      model.mouthOpenY = this.mouthOpenY;
      model.cheek = this.cheek;
      model.bodyAngleX = this.bodyAngleX;
      model.bodyAngleY = this.bodyAngleY;
      model.bodyAngleZ = this.bodyAngleZ;
      model.breath = this.breath;
      model.armLA = this.armLA;
      model.armRA = this.armRA;
      model.armLB = this.armLB;
      model.armRB = this.armRB;
      model.handL = this.handL;
      model.handR = this.handR;
      model.hairFront = this.hairFront;
      model.hairSide = this.hairSide;
      model.hairBack = this.hairBack;
      model.hairFluffy = this.hairFluffy;
      model.shoulderY = this.shoulderY;
      model.bustX = this.bustX;
      model.bustY = this.bustY;
      model.baseX = this.baseX;
      model.baseY = this.baseY;


      if (model.getModel()) {
        if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
          // 横に長いモデルを縦長ウィンドウに表示する際モデルの横サイズでscaleを算出する
          model.getModelMatrix().setWidth(2.0);
          projection.scale(1.0, width / height);
        } else {
          projection.scale(height / width, 1.0);
        }

        // 必要があればここで乗算
        if (this._viewMatrix != null) {
          projection.multiplyByMatrix(this._viewMatrix);
        }
      }

      model.update();
      model.draw(projection); // 参照渡しなのでprojectionは変質する。
    }
  }

  /**
   * 次のシーンに切りかえる
   * サンプルアプリケーションではモデルセットの切り替えを行う。
   */
  public nextScene(): void {
    const no: number = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
    this.changeScene(no);
  }

  /**
   * シーンを切り替える
   * サンプルアプリケーションではモデルセットの切り替えを行う。
   */
  public changeScene(index: number): void {
    this._sceneIndex = index;
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP]model index: ${this._sceneIndex}`);
    }

    // ModelDir[]に保持したディレクトリ名から
    // model3.jsonのパスを決定する。
    // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
    const model: string = LAppDefine.ModelDir[index];
    const modelPath: string = LAppDefine.ResourcesPath + model + '/';
    let modelJsonName: string = LAppDefine.ModelDir[index];
    modelJsonName += '.model3.json';

    this.releaseAllModel();
    this._models.pushBack(new LAppModel());
    this._models.at(0).loadAssets(modelPath, modelJsonName);
  }

  public setViewMatrix(m: CubismMatrix44) {
    for (let i = 0; i < 16; i++) {
      this._viewMatrix.getArray()[i] = m.getArray()[i];
    }
  }

  /**
   * コンストラクタ
   */
  constructor() {
    this._viewMatrix = new CubismMatrix44();
    this._models = new csmVector<LAppModel>();
    this._sceneIndex = 0;
    this.changeScene(this._sceneIndex);
  }

  _viewMatrix: CubismMatrix44; // モデル描画に用いるview行列
  _models: csmVector<LAppModel>; // モデルインスタンスのコンテナ
  _sceneIndex: number; // 表示するシーンのインデックス値
  // モーション再生終了のコールバック関数
  _finishedMotion = (self: ACubismMotion): void => {
    LAppPal.printMessage('Motion Finished:');
    console.log(self);
  };

  //綁定參數
  public angleX:number = 0;
  public angleY:number = 0;
  public angleZ:number = 0;
  public eyeLOpen:number = 0;
  public eyeLSmile:number = 0;
  public eyeROpen:number = 0;
  public eyeRSmile:number = 0;
  public eyeBallX:number = 0;
  public eyeBallY:number = 0;
  public eyeBallForm:number=0;
  public browLY:number=0;
  public browRY:number=0;
  public browLX:number=0;
  public browRX:number=0;
  public browLAngle:number=0;
  public browRAngle:number=0;
  public browLForm:number=0;
  public browRForm:number=0;
  //mouth form
  public mouthForm: number = 0;
  //mouth openY
  public mouthOpenY: number = 0;
  public cheek:number=0;
  public bodyAngleX:number = 0;
  public bodyAngleY:number = 0;
  public bodyAngleZ:number = 0;
  public breath:number=0;
  public armLA:number=0;
  public armRA:number=0;
  public armLB:number=0;
  public armRB:number=0;
  public handL:number=0;
  public handR:number=0;
  public hairFront:number=0;
  public hairSide:number=0;
  public hairBack:number=0;
  public hairFluffy:number=0;
  public shoulderY:number=0;
  public bustX:number=0;
  public bustY:number=0;
  public baseX:number=0;
  public baseY:number=0;
}
