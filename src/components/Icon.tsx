import React, {memo, useMemo} from 'react';
import {View, ViewStyle} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {iconXml, IconName} from '../assets/iconXml';
import {useThemeColors} from '../theme';

export type {IconName};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

function tintSvg(xml: string, color: string) {
  return xml
    .replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, `stroke="${color}"`)
    .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, match =>
      match.toLowerCase().includes('none') ? match : `fill="${color}"`,
    );
}

export const Icon = memo(function Icon({
  name,
  size = 20,
  color,
  style,
}: IconProps) {
  const themeColors = useThemeColors();
  const resolvedColor = color ?? themeColors.actionBlue;

  const xml = useMemo(() => {
    const source = iconXml[name];
    return tintSvg(source, resolvedColor);
  }, [name, resolvedColor]);

  return (
    <View style={[{width: size, height: size, overflow: 'hidden'}, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
});
