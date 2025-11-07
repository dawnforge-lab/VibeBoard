#!/usr/bin/env tsx

/**
 * Font Pack Validation Script
 * Validates font pack JSON files for structural integrity and completeness
 *
 * Usage:
 *   pnpm validate-packs                    # Validate all packs
 *   pnpm validate-packs default            # Validate specific pack
 */

import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

interface Style {
  id: string;
  name: string;
  preview: string;
  mapping: Record<string, string>;
}

interface Decorator {
  id: string;
  name: string;
  pattern: string;
}

interface FontPack {
  id: string;
  name: string;
  category: string;
  version: string;
  description: string;
  price: number;
  styles: Style[];
  decorators: Decorator[];
}

interface ValidationError {
  packId: string;
  field: string;
  message: string;
}

const REQUIRED_ASCII_CHARS = [
  // Lowercase letters
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  // Uppercase letters
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  // Numbers
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  // Common punctuation and space
  ' ',
  '.',
  ',',
  '!',
  '?',
];

const VALID_CATEGORIES = ['core', 'aesthetic', 'seasonal', 'community'];

function validatePack(pack: FontPack): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check required top-level fields
  if (!pack.id || typeof pack.id !== 'string') {
    errors.push({
      packId: pack.id || 'unknown',
      field: 'id',
      message: 'Pack must have a valid string id',
    });
  }

  if (!pack.name || typeof pack.name !== 'string') {
    errors.push({
      packId: pack.id,
      field: 'name',
      message: 'Pack must have a valid string name',
    });
  }

  if (!pack.category || !VALID_CATEGORIES.includes(pack.category)) {
    errors.push({
      packId: pack.id,
      field: 'category',
      message: `Pack category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  if (!pack.version || typeof pack.version !== 'string') {
    errors.push({
      packId: pack.id,
      field: 'version',
      message: 'Pack must have a valid version string',
    });
  }

  if (typeof pack.price !== 'number' || pack.price < 0) {
    errors.push({
      packId: pack.id,
      field: 'price',
      message: 'Pack price must be a non-negative number',
    });
  }

  if (!Array.isArray(pack.styles) || pack.styles.length === 0) {
    errors.push({
      packId: pack.id,
      field: 'styles',
      message: 'Pack must have at least one style',
    });
    return errors; // Cannot continue validation without styles
  }

  if (!Array.isArray(pack.decorators)) {
    errors.push({
      packId: pack.id,
      field: 'decorators',
      message: 'Pack must have a decorators array (can be empty)',
    });
  }

  // Validate each style
  const styleIds = new Set<string>();
  pack.styles.forEach((style, index) => {
    // Check style fields
    if (!style.id || typeof style.id !== 'string') {
      errors.push({
        packId: pack.id,
        field: `styles[${index}].id`,
        message: 'Style must have a valid string id',
      });
    } else {
      // Check for duplicate style IDs
      if (styleIds.has(style.id)) {
        errors.push({
          packId: pack.id,
          field: `styles[${index}].id`,
          message: `Duplicate style id: ${style.id}`,
        });
      }
      styleIds.add(style.id);
    }

    if (!style.name || typeof style.name !== 'string') {
      errors.push({
        packId: pack.id,
        field: `styles[${index}].name`,
        message: 'Style must have a valid string name',
      });
    }

    if (!style.preview || typeof style.preview !== 'string') {
      errors.push({
        packId: pack.id,
        field: `styles[${index}].preview`,
        message: 'Style must have a valid preview string',
      });
    }

    // Validate character mappings
    if (!style.mapping || typeof style.mapping !== 'object') {
      errors.push({
        packId: pack.id,
        field: `styles[${index}].mapping`,
        message: 'Style must have a valid mapping object',
      });
    } else {
      // Check for missing required characters
      const mappedChars = new Set(Object.keys(style.mapping));
      const missingChars = REQUIRED_ASCII_CHARS.filter(
        (char) => !mappedChars.has(char)
      );

      if (missingChars.length > 0) {
        errors.push({
          packId: pack.id,
          field: `styles[${index}].mapping`,
          message: `Style "${style.id}" missing mappings for characters: ${missingChars.map((c) => (c === ' ' ? "'space'" : `'${c}'`)).join(', ')}`,
        });
      }
    }
  });

  // Validate decorators
  const decoratorIds = new Set<string>();
  pack.decorators?.forEach((decorator, index) => {
    if (!decorator.id || typeof decorator.id !== 'string') {
      errors.push({
        packId: pack.id,
        field: `decorators[${index}].id`,
        message: 'Decorator must have a valid string id',
      });
    } else {
      // Check for duplicate decorator IDs
      if (decoratorIds.has(decorator.id)) {
        errors.push({
          packId: pack.id,
          field: `decorators[${index}].id`,
          message: `Duplicate decorator id: ${decorator.id}`,
        });
      }
      decoratorIds.add(decorator.id);
    }

    if (!decorator.name || typeof decorator.name !== 'string') {
      errors.push({
        packId: pack.id,
        field: `decorators[${index}].name`,
        message: 'Decorator must have a valid string name',
      });
    }

    if (!decorator.pattern || typeof decorator.pattern !== 'string') {
      errors.push({
        packId: pack.id,
        field: `decorators[${index}].pattern`,
        message: 'Decorator must have a valid pattern string',
      });
    } else if (!decorator.pattern.includes('{text}')) {
      errors.push({
        packId: pack.id,
        field: `decorators[${index}].pattern`,
        message: 'Decorator pattern must include {text} placeholder',
      });
    }
  });

  return errors;
}

function loadPackFile(filePath: string): FontPack | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load pack file: ${filePath}`);
    console.error(
      `   Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  const dataDir = resolve(__dirname, '../data/packs');

  console.log('🔍 VibeBoard Font Pack Validator\n');

  let packFiles: string[];

  if (args.length > 0) {
    // Validate specific pack(s)
    packFiles = args.map((packName) => {
      const fileName = packName.endsWith('.json')
        ? packName
        : `${packName}.json`;
      return join(dataDir, fileName);
    });
  } else {
    // Validate all packs in data/packs/
    try {
      const allFiles = readdirSync(dataDir);
      packFiles = allFiles
        .filter((file) => file.endsWith('.json'))
        .map((file) => join(dataDir, file));
    } catch (error) {
      console.error(`❌ Failed to read packs directory: ${dataDir}`);
      console.error(
        `   Error: ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  }

  if (packFiles.length === 0) {
    console.error('❌ No pack files found to validate');
    process.exit(1);
  }

  console.log(`📦 Found ${packFiles.length} pack(s) to validate\n`);

  let totalErrors = 0;
  let validPacks = 0;

  packFiles.forEach((filePath) => {
    const pack = loadPackFile(filePath);
    if (!pack) {
      totalErrors++;
      return;
    }

    const errors = validatePack(pack);

    if (errors.length === 0) {
      console.log(`✅ ${pack.name} (${pack.id})`);
      console.log(`   Version: ${pack.version}`);
      console.log(`   Styles: ${pack.styles.length}`);
      console.log(`   Decorators: ${pack.decorators?.length || 0}`);
      console.log('');
      validPacks++;
    } else {
      console.log(`❌ ${pack.name || 'Unknown'} (${pack.id || 'unknown'})`);
      errors.forEach((error) => {
        console.log(`   • [${error.field}] ${error.message}`);
      });
      console.log('');
      totalErrors += errors.length;
    }
  });

  console.log('━'.repeat(60));
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Valid packs: ${validPacks}/${packFiles.length}`);
  console.log(`   Total errors: ${totalErrors}\n`);

  if (totalErrors > 0) {
    console.error('❌ Validation failed with errors');
    process.exit(1);
  } else {
    console.log('✅ All packs are valid!');
    process.exit(0);
  }
}

main();
