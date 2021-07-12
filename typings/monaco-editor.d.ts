declare namespace MonacoEditor {
    function _interpolateUnit(segment: string, unitIdx: number): string;
    function _parseDecimal(decimal: string): string;
    function formatRMB(num: number, prefix?: string): response;
  
    interface response {
      errCode: number;
      msg: string;
      value: string;
    }
  
    const DigitalList: string[];
    const TailSepartorLabel: string[];
    const MiddleSepartorLabel: string[];
  }
  
  
  export = MonacoEditor;