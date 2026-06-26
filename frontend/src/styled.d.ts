import 'styled-components'
import { AppTheme } from './presentation/theme/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
