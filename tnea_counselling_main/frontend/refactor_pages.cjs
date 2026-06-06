const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 1. Remove collapsed padding
  content = content.replace(/\$\{collapsed \? 'lg:pl-\[192px\]' : ''\}/g, '');
  content = content.replace(/\$\{collapsed \? 'lg:pl-\[192px\]' : 'lg:pl-0'\}/g, '');
  
  // Clean up trailing/leading spaces inside template strings caused by removal
  content = content.replace(/ \`\}/g, '`}');
  content = content.replace(/  \`\}/g, '`}');
  content = content.replace(/\{\` /g, '{`');
  content = content.replace(/duration-300 \`/g, 'duration-300`');

  // 2. Remove sticky headers entirely, replacing with static flex headers
  const stickyReplacements = [
    {
      from: 'className="sticky top-0 z-30 -mt-5 lg:-mt-7 pt-6 pb-2 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent"',
      to: 'className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"'
    },
    {
      from: 'className="sticky top-0 z-40 -mt-5 lg:-mt-7 pt-6 pb-2 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent"',
      to: 'className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"'
    },
    {
      from: 'className="sticky top-0 z-40 -mt-5 lg:-mt-7 pt-6 pb-2 mb-10 flex flex-col gap-4 bg-transparent"',
      to: 'className="flex flex-col gap-4 mb-10"'
    },
    {
      from: 'className="sticky top-0 z-40 pt-6 pb-2 bg-transparent mb-4 flex flex-col gap-4"',
      to: 'className="flex flex-col gap-4 mb-4"'
    },
    // Domain selectors if they have sticky
    {
      from: 'className="sticky top-[72px] z-40 flex pointer-events-none py-2 -mx-4 px-4 sm:mx-0 sm:px-0"',
      to: 'className="flex pointer-events-none py-2 -mx-4 px-4 sm:mx-0 sm:px-0"'
    },
    {
      from: 'className="sticky top-[72px] z-30 flex pointer-events-none py-2 -mx-4 px-4 sm:mx-0 sm:px-0"',
      to: 'className="flex pointer-events-none py-2 -mx-4 px-4 sm:mx-0 sm:px-0"'
    }
  ];

  for (const rep of stickyReplacements) {
    content = content.replace(rep.from, rep.to);
  }

  // Handle Dashboard sticky top-0
  content = content.replace(
    'className="sticky top-0 z-40 pt-2 pb-2 bg-transparent mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"',
    'className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"'
  );
  content = content.replace(
    'className="sticky top-0 z-30 pt-2 pb-2 bg-transparent mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"',
    'className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Completed updating ${updatedCount} files.`);
