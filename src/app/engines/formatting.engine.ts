import * as _ from 'lodash';

export class FormattingEngine {
  
  public static convertToFileSafe(s: string): string {
    return _.kebabCase(s);
  }
  
}
