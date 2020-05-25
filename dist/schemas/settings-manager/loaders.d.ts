import { Node, DataLoader } from '@via-profit-services/core';
import { ISettingsNode, Context } from './types';
interface Loaders {
    settings: DataLoader<string, Node<ISettingsNode>>;
}
export default function createLoaders(context: Context): Loaders;
export {};
