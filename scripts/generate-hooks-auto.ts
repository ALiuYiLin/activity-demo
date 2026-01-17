import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { VarLayer } from './types';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
