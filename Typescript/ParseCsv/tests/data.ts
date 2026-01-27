/**
 * CSV fixtures for tests.
 * Notes:
 * - line numbers are 1-based, header is line 1.
 */

export const CSV_VALID = `id,name,setCode,type,cost,unique
L-001,Alpha Leader,OGN,LEADER,0,true
U-001,Piltovan Scout,OGN,UNIT,2,false
S-001,Quick Spell,OGN,SPELL,1,false
I-001,Training Gear,OGN,ITEM,3,false
`;

// Wrong setCode on line 3
export const CSV_BAD_SET = `id,name,setCode,type,cost,unique
L-001,Alpha Leader,OGN,LEADER,0,true
U-001,Piltovan Scout,XYZ,UNIT,2,false
`;

// Missing required column 'unique'
export const CSV_MISSING_COLUMN = `id,name,setCode,type,cost
L-001,Alpha Leader,OGN,LEADER,0
`;

// Unknown extra column 'rarity' (strictHeader should flag it)
export const CSV_UNKNOWN_COLUMN = `id,name,setCode,type,cost,unique,rarity
L-001,Alpha Leader,OGN,LEADER,0,true,LEGENDARY
`;

// Bad number in cost (line 2)
export const CSV_BAD_COST = `id,name,setCode,type,cost,unique
L-001,Alpha Leader,OGN,LEADER,abc,true
`;

// Bad boolean in unique (line 2)
export const CSV_BAD_UNIQUE = `id,name,setCode,type,cost,unique
L-001,Alpha Leader,OGN,LEADER,0,maybe
`;

// CSV parse: quoted field with comma inside should be supported
export const CSV_QUOTED_COMMA = `id,name,setCode,type,cost,unique
U-002,"Name, With Comma",OGN,UNIT,1,false
`;
