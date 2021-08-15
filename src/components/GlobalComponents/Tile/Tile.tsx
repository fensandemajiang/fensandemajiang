import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Tile as TileType, Wind, Dragon, Flower, Suite } from '../../../types';
import fengwest from '../../../img/tiles/processed/feng-west.png';
import longred from '../../../img/tiles/processed/long-red.png';
import tiaosan from '../../../img/tiles/processed/tiao-san.png';
import wanyi from '../../../img/tiles/processed/wan-yi.png';
import wanwu from '../../../img/tiles/processed/wan-wu.png';
import fengnorth from '../../../img/tiles/processed/feng-north.png';
import wanba from '../../../img/tiles/processed/wan-ba.png';
import tiaoer from '../../../img/tiles/processed/tiao-er.png';
import tiaosi from '../../../img/tiles/processed/tiao-si.png';
import tongqi from '../../../img/tiles/processed/tong-qi.png';
import tiaojiu from '../../../img/tiles/processed/tiao-jiu.png';
import huacrysanthemum from '../../../img/tiles/processed/hua-crysanthemum.png';
import huabamboo from '../../../img/tiles/processed/hua-bamboo.png';
import fengsouth from '../../../img/tiles/processed/feng-south.png';
import tiaoliu from '../../../img/tiles/processed/tiao-liu.png';
import waner from '../../../img/tiles/processed/wan-er.png';
import tiaoba from '../../../img/tiles/processed/tiao-ba.png';
import wansi from '../../../img/tiles/processed/wan-si.png';
import fengeast from '../../../img/tiles/processed/feng-east.png';
import huaautumn from '../../../img/tiles/processed/hua-autumn.png';
import tiaoyi from '../../../img/tiles/processed/tiao-yi.png';
import tiaowu from '../../../img/tiles/processed/tiao-wu.png';
import tonger from '../../../img/tiles/processed/tong-er.png';
import longgreen from '../../../img/tiles/processed/long-green.png';
import tongsi from '../../../img/tiles/processed/tong-si.png';
import wansan from '../../../img/tiles/processed/wan-san.png';
import tongjiu from '../../../img/tiles/processed/tong-jiu.png';
import wanqi from '../../../img/tiles/processed/wan-qi.png';
import tongliu from '../../../img/tiles/processed/tong-liu.png';
import huasummer from '../../../img/tiles/processed/hua-summer.png';
import huawinter from '../../../img/tiles/processed/hua-winter.png';
import tongwu from '../../../img/tiles/processed/tong-wu.png';
import tongyi from '../../../img/tiles/processed/tong-yi.png';
import wanliu from '../../../img/tiles/processed/wan-liu.png';
import tongba from '../../../img/tiles/processed/tong-ba.png';
import huaspring from '../../../img/tiles/processed/hua-spring.png';
import huaplum from '../../../img/tiles/processed/hua-plum.png';
import huaorchid from '../../../img/tiles/processed/hua-orchid.png';
import wanjiu from '../../../img/tiles/processed/wan-jiu.png';
import tongsan from '../../../img/tiles/processed/tong-san.png';
import longwhite from '../../../img/tiles/processed/long-white.png';
import tiaoqi from '../../../img/tiles/processed/tiao-qi.png';
import './Tile.css';

function Tile(props: InferProps<typeof Tile.propTypes>) {
  function getImg(tile: TileType) {
    let img = fengwest;

    const numbers = ['yi', 'er', 'san', 'si', 'wu', 'liu', 'qi', 'ba', 'jiu'];
    switch (tile.suite) {
      case Suite.Wan:
        switch (tile.value) {
          case 1:
            img = wanyi;
            break;
          case 2:
            img = waner;
            break;
          case 3:
            img = wansan;
            break;
          case 4:
            img = wansi;
            break;
          case 5:
            img = wanwu;
            break;
          case 6:
            img = wanliu;
            break;
          case 7:
            img = wanqi;
            break;
          case 8:
            img = wanba;
            break;
          case 9:
            img = wanjiu;
            break;
        }
        break;
      case Suite.Tong:
        switch (tile.value) {
          case 1:
            img = tongyi;
            break;
          case 2:
            img = tonger;
            break;
          case 3:
            img = tongsan;
            break;
          case 4:
            img = tongsi;
            break;
          case 5:
            img = tongwu;
            break;
          case 6:
            img = tongliu;
            break;
          case 7:
            img = tongqi;
            break;
          case 8:
            img = tongba;
            break;
          case 9:
            img = tongjiu;
            break;
        }
        break;
      case Suite.Tiao:
        switch (tile.value) {
          case 1:
            img = tiaoyi;
            break;
          case 2:
            img = tiaoer;
            break;
          case 3:
            img = tiaosan;
            break;
          case 4:
            img = tiaosi;
            break;
          case 5:
            img = tiaowu;
            break;
          case 6:
            img = tiaoliu;
            break;
          case 7:
            img = tiaoqi;
            break;
          case 8:
            img = tiaoba;
            break;
          case 9:
            img = tiaojiu;
            break;
        }
        break;
      case Suite.Winds:
        switch (tile.wind) {
          case Wind.East:
            img = fengeast;
            break;
          case Wind.North:
            img = fengnorth;
            break;
          case Wind.South:
            img = fengsouth;
            break;
          case Wind.West:
            img = fengwest;
            break;
        }
        break;
      case Suite.Dragons:
        switch (tile.dragon) {
          case Dragon.Green:
            img = longgreen;
            break;
          case Dragon.Red:
            img = longred;
            break;
          case Dragon.White:
            img = longwhite;
            break;
        }
        break;
      case Suite.Flowers:
        switch (tile.flower) {
          case Flower.Summer:
            img = huasummer;
            break;
          case Flower.Fall:
            img = huaautumn;
            break;
          case Flower.Winter:
            img = huawinter;
            break;
          case Flower.Spring:
            img = huaspring;
            break;
          case Flower.Bamboo:
            img = huabamboo;
            break;
          case Flower.Chrys:
            img = huacrysanthemum;
            break;
          case Flower.Orchid:
            img = huaorchid;
            break;
          case Flower.Plum:
            img = huaplum;
            break;
        }
        break;
    }
    return img;
  }

  const img = props.tile ? getImg(props.tile) : '';

  return (
    <>
      <img
        className={'tile ' + (props.className ? props.className : '')}
        onClick={props.onClick ? props.onClick : undefined}
        src={img}
      ></img>
    </>
  );
}

Tile.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  tile: PropTypes.any,
};

export default Tile;
