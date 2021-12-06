declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>
  export default content;//todo arquivo/conteúdo svg será um componente React com SvgProps
}