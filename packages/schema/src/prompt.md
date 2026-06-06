return as json of { name: field name, type: field class, description?: the comment of field, category?: category of field, visibleWhen?: {field: string;
value: unknown}} for the java code bellow

<br />

read unit.json and apply metadata to corresponding field in unit.ts using metadata() function import from utils.ts

<br />

update schema metadata using metadata() function import from schema package utils.ts, no need to read other files, dont add unknown fields, just let me know at the end, make sure to add metadata to all field, if im not providing java source code for that file (type) its mean that  there is nothing special about it so just use daufault value, { name: field name, type: field class, description?: the comment of field, category?: category of field, visibleWhen?: {field: string;
value: unknown}}, use translation key with "editor." prefix and only use \[a-z0-9-.] and update en/translation.ts, java source code bellow: 
