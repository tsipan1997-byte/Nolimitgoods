// Реєстр джерел. Ritchie Bros (rbauction / IronPlanet) НЕ додаємо: вони забороняють вивезення техніки в Україну.
import euroauctions from './euroauctions.mjs';
import wilsons from './wilsons.mjs';
import cheffins from './cheffins.mjs';
import brightwells from './brightwells.mjs';
import bca from './bca.mjs';
import dealers from './dealers.mjs';

export const SOURCES = [euroauctions, wilsons, cheffins, brightwells, bca, dealers];
export const BANNED_HOUSES = new Set(['Ritchie Bros', 'IronPlanet']);
