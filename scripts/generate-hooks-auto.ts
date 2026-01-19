import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { Config, VarLayer } from './types';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从 CSV 文件读取配置
const loadConfigFromCSV = (): Config[] => {
  const csvPath = path.resolve(__dirname, './config.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((row: any) => {
    // 解析 defaultValue
    let defaultValue: any = row.defaultValue;
    if (row.type === 'number') {
      defaultValue = Number(row.defaultValue) || 0;
    } else if (row.type === 'boolean') {
      defaultValue = row.defaultValue === 'true';
    } else if (row.type === 'array') {
      try {
        // 处理数组格式，如 [] 或 [{tag_id:1,num:0}]
        defaultValue = row.defaultValue ? eval(`(${row.defaultValue})`) : [];
      } catch {
        defaultValue = [];
      }
    } else if (row.type === 'function') {
      defaultValue = undefined;
    }

    // 将 CSV 中的 layer 字符串映射到 VarLayer 枚举
    const layerMap: Record<string, VarLayer> = {
      'Meta': VarLayer.Meta,
      'Derived': VarLayer.Derived,
      'UI': VarLayer.UI,
      'Option': VarLayer.Option,
    };

    return {
      name: row.name,
      desc: row.desc,
      type: row.type,
      defaultValue,
      layer: layerMap[row.layer] || VarLayer.Meta,
    } as Config;
  });
};

const config = loadConfigFromCSV();

const mapType = (type: string, defaultValue: any): string => {
  if (type === 'array') {
    if (Array.isArray(defaultValue) && defaultValue.length > 0) {
       return 'any[]'; 
    }
    return 'any[]';
  }
  return type;
}

const generateHook = async (hookName: string, layers: VarLayer[], templateName: string, extraContext: any = {}) => {
  console.log(`Generating ${hookName}...`);

  // Filter variables based on selected layers
  const vars = config
    .filter(item => layers.includes(item.layer))
    .map(item => ({
      name: item.name,
      capitalizedName: item.name.charAt(0).toUpperCase() + item.name.slice(1),
      description: item.desc,
      defaultValue: JSON.stringify(item.defaultValue),
      type: mapType(item.type, item.defaultValue)
    }));

  const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  const result = template({
    hookName: hookName,
    capitalizedHookName: hookName.charAt(0).toUpperCase() + hookName.slice(1),
    vars,
    ...extraContext
  });

  const outputPath = path.resolve(process.cwd(), `dist/hooks/${hookName}.ts`);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, result);

  console.log(`Success! Generated ${hookName} at ${outputPath}`);
  console.log(`Variables included: ${vars.length}\n`);
};

const generateAll = async () => {
  // 1. useBase (Meta data)
  await generateHook('useBase', [VarLayer.Meta], 'base-hook.hbs');

  // 2. useDerived (Derived data)
  await generateHook('useDerived', [VarLayer.Derived], 'derived-hook.hbs', {
    hasProps: true,
    imports: [
      "import { UseBaseReturn } from './useBase'",
      "import { UseUIReturn } from './useUI'"
    ],
    propsType: "UseUIReturn & UseBaseReturn"
  });

  // 3. useUI (UI data)
  await generateHook('useUI', [VarLayer.UI], 'ui-hook.hbs');

  // 4. useOptions (Option data)
  await generateHook('useOptions', [VarLayer.Option], 'options-hook.hbs', {
    hasProps: true,
    imports: [
      "import { UseBaseReturn } from './useBase'",
      "import { UseDerivedReturn } from './useDerived'",
      "import { UseUIReturn } from './useUI'"
    ],
    propsType: "UseBaseReturn & UseDerivedReturn & UseUIReturn"
  });
};

generateAll().catch(console.error);
