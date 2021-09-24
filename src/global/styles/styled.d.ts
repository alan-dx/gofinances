import 'styled-components'
import theme from './theme'

declare module 'styled-components' {
  type ThemeType = typeof theme//ThemeType herda a tipagem de theme

  export interface DefaultTheme extends ThemeType {}
}