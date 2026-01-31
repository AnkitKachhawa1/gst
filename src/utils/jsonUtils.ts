
export function flattenGstr2bJson(jsonData: any): any[] {
  let rows: any[] = [];
  
  // GSTR-2B Extraction Logic
  if (jsonData?.data?.docdata?.b2b) {
      const b2b = jsonData.data.docdata.b2b;
      if (Array.isArray(b2b)) {
          b2b.forEach((supplier: any) => {
              const supplierInfo = { ...supplier };
              delete supplierInfo.inv; // Remove nested array from parent
              if (supplier.inv && Array.isArray(supplier.inv)) {
                  supplier.inv.forEach((inv: any) => {
                      rows.push({ ...supplierInfo, ...inv });
                  });
              }
          });
      }
  } else if (jsonData?.b2b && Array.isArray(jsonData.b2b)) {
      // Direct b2b array
      const b2b = jsonData.b2b;
      b2b.forEach((supplier: any) => {
          const supplierInfo = { ...supplier };
          delete supplierInfo.inv;
          if (supplier.inv && Array.isArray(supplier.inv)) {
              supplier.inv.forEach((inv: any) => {
                  rows.push({ ...supplierInfo, ...inv });
              });
          }
      });
  } else if (Array.isArray(jsonData)) {
      rows = jsonData;
  } else if (typeof jsonData === 'object') {
      // Fallback: look for first array value
      for (const val of Object.values(jsonData)) {
          if (Array.isArray(val)) {
              rows = val;
              break;
          }
      }
  }
  
  return rows;
}
