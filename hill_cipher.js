// Aaron Councilman, 2021
const cipherText = "Cmtrd ngizju, ezn vsqeughc pchn kjo vao. T lpnd girqn lh nhkvujc exvw, iba pxeirn. Xuuan wal wnw hatd gxc ygxyi aauk cf cmabr ksja wkhkilkto. Exvg wm u wzstga pp giesdecznr ajf bbosbkop usrt. Koyg muan afpcid pv vjgl sjguvb, ldv oybczgg tmwvzh. Jl gie wal qzsplbf kcnm, ng omcbxk: ls e ufdy qaoz zg usqrudc, I itdt lqhqsw b czto pb kbjcgwn tnri oax kjgl nm ngzagc. -Fktob";
const justCipher = cleanText(cipherText);

const len = cipherText.length;
const cipherLen = justCipher.length;

const cols = 18;
const rows = Math.ceil(len / cols);
const bunches = Math.floor(cipherLen / 3);

const nColors = 6;
const colors = ["red", "orange", "yellow", "green", "blue", "violet"];

// Display the cipher-text and input boxes
var tableHtml = "";
var i = 0;

for (let r = 0; r < rows; r++) {
  var letters = "";
  var inpts = "";
  for (let c = 0; c < cols; c++) {
    var ch = cipherText.charAt(r * cols + c);
    
    letters = letters + '<td>' + ch + "</td>";
    
    if (isAlpha(ch)) {
      inpts = inpts + '<td bgcolor="' + colors[Math.floor(i / 3) % nColors] 
          + '"><input type="text" maxlength="1" id="i' + i + '"></td>';
      i = i + 1;
    } else {
      inpts = inpts + '<td bgcolor="black"></td>';
    }
  }
  tableHtml = tableHtml + "<tr>" + letters + "</tr><tr>" + inpts + "</tr>";
}

document.getElementById("cipherText").innerHTML = tableHtml;

// Actual functions
function breakCipher() {
  document.getElementById("lenError").innerHTML = "";
  document.getElementById("valError").innerHTML = "";
  document.getElementById("keyError").innerHTML = "";
  document.getElementById("slvError").innerHTML = "";
  
  var lhs = [];
  var rhs = [];
  var cnt = 0;
  
  var errLen = false;
  var errVal = false;
  for (let b = 0; b < bunches; b++) {
    vals = [document.getElementById('i' + (b * 3)).value,
            document.getElementById('i' + (b*3+1)).value,
            document.getElementById('i' + (b*3+2)).value];
    if (vals[0].length > 1 || vals[1].length > 1 || vals[2].length > 1) {
      errLen = true;
    } else if ((vals[0].length === 1 && !isAlpha(vals[0]))
            || (vals[1].length === 1 && !isAlpha(vals[1]))
            || (vals[2].length === 1 && !isAlpha(vals[2]))) {
      errVal = true;
    } else if (vals[0].length == 1 && vals[1].length == 1 && vals[2].length == 1) {
      // a triple with useful information, add the info to lhs and rhs
      
      const p1 = alphaToInt(vals[0]);
      const p2 = alphaToInt(vals[1]);
      const p3 = alphaToInt(vals[2]);
      
      const c1 = alphaToInt(justCipher.charAt(b * 3));
      const c2 = alphaToInt(justCipher.charAt(b*3+1));
      const c3 = alphaToInt(justCipher.charAt(b*3+2));
      
      lhs[cnt] = [p1, p2, p3, 0, 0, 0, 0, 0, 0];
      rhs[cnt] = c1;
      cnt += 1;
      
      lhs[cnt] = [0, 0, 0, p1, p2, p3, 0, 0, 0];
      rhs[cnt] = c2;
      cnt += 1;
      
      lhs[cnt] = [0, 0, 0, 0, 0, 0, p1, p2, p3];
      rhs[cnt] = c3;
      cnt += 1;
    }
  }
  
  if (errLen) {
    document.getElementById("lenError").innerHTML = "Only one character allowed per text-box";
  }
  if (errVal) {
    document.getElementById("valError").innerHTML = "Only alphabetic characters allowed in the text-boxes";
  }
  if (!errLen && !errVal) {
    var errKey = false;
    
    for (let k = 0; k < 9; k++) {
      const val = document.getElementById("k" + k).value;
      if (val.length > 0 && !isNumeric(val)) {
        errKey = true;
      } else if (val.length > 0) {
        l = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        l[k] = 1;
        
        lhs[cnt] = l;
        rhs[cnt] = parseInt(val, 10);
        cnt += 1;
      }
    }
    
    if (errKey) {
      document.getElementById("keyError").innerHTML = "Only numbers permitted in the key";
    } else {
      var res = solve(lhs, rhs);
      if (!res[0]) {
        document.getElementById("slvError").innerHTML = "Contradiction found while solving; something in your input is wrong";
      } else {
        document.getElementById("solveRes").innerHTML = processSolve(res[1], res[2]);
      }
    }
  }
  
  window.scrollTo(0, document.body.scrollHeight);
}

function isAlpha(str) {
  const code = str.charCodeAt(0);
  return (code > 64 && code < 91) || (code > 96 && code < 123);
}
function alphaToInt(str) {
  const code = str.charCodeAt(0);
  if (code > 96) {
    return code - 97;
  } else {
    return code - 65;
  }
}

function isNumeric(str) {
  const len = str.length;
  if (len === 0) { return false; }

  for (let i = 0; i < len; i++) {
    const code = str.charCodeAt(i);
    if (code < 48 || code > 57) {
      return false;
    }
  }
  return true;
}

function cleanText(str) {
  const slen = str.length;
  var res = "";
  
  for (let i = 0; i < slen; i++) {
    if (isAlpha(str.charAt(i))) {
      res = res + str.charAt(i);
    }
  }

  return res;
}

function solve(lhs, rhs) {
  if (lhs.length === 0) {
    return [[], []];
  }
  
  const nEqs = lhs.length;
  const nVar = lhs[0].length;
    
  var v = 0;
  var e = 0;
  while (v < nVar && e < nEqs) {
    // We find the "best" coefficient for this variable, the preference is
    // for invertible coefficients, and then smaller within that
    if (true) {
      var nI = nEqs;
      var bestCoef;
      for (let i = e; i < nEqs; i++) {
        if (lhs[i][v] !== 0) {
          if (nI === nEqs) {
            // first equation with this variable
            nI = i;
            bestCoef = lhs[i][v];
          } else {
            if (betterCoef(lhs[i][v], bestCoef)) {
              nI = i;
              bestCoef = lhs[i][v];
            }
          }
        }
      }
      if (nI === nEqs) {
        // no value in this column, proceed to next
        v += 1;
        continue;
      }
      
      const tmpL = lhs[e];
      lhs[e] = lhs[nI];
      lhs[nI] = tmpL;
      
      const tmpR = rhs[e];
      rhs[e] = rhs[nI];
      rhs[nI] = tmpR;
    }
    
    for (let i = 0; i < nEqs; i++) {
      if (i === e) { continue; }
      if (lhs[i][v] === 0) { continue; }
      const mulArr = pickMultipliers(lhs[e][v], lhs[i][v]);
      const mulI = mulArr[0];
      const mulV = mulArr[1];
      
      multiplyRow(lhs[i], mulI);
      rhs[i] = (rhs[i] * mulI) % 26;
      subtractRow(lhs[i], lhs[e], mulV);
      rhs[i] = mod(rhs[i] - mulV * rhs[e], 26);
    }
    
    v += 1;
    e += 1;
  }
  
  var contradiction = false;
  var changed;
  do {
    changed = false;
    
    for (let i = 0; i < nEqs; i++) {
      if (rhs[i] !== 0 && allZeros(lhs[i])) {
        contradiction = true;
        break;
      }
      
      const justOneRes = justOne(lhs[i]);
      if (justOneRes[0]) {
        const vEq = solveForVariable(justOneRes[1], rhs[i]);
        if (vEq[0]) {
          const varIdx = justOneRes[2];
          const varVal = vEq[1];
          lhs[i][varIdx] = 1;
          rhs[i] = varVal;
          
          // Change all other rows that involve this variable to reflect this
          // new value
          for (let e = 0; e < nEqs; e++) {
            if (i === e) { continue; }
            if (lhs[e][varIdx] !== 0) {
              changed = true;
              rhs[e] = mod(rhs[e] - lhs[e][varIdx] * varVal, 26);
              lhs[e][varIdx] = 0;
            }
          }
        }
      }
    }
  } while (changed && !contradiction);
  
  if (contradiction) { return [false]; }
  else { return [true, lhs, rhs]; }
}

function invertible(x) {
  return x % 2 !== 0 && x % 13 !== 0;
}
function invert(x) {
  switch (x) {
    case 1: return 1;
    case 3: return 9;
    case 5: return 21;
    case 7: return 15;
    case 9: return 3;
    case 11: return 19;
    case 15: return 7;
    case 17: return 23;
    case 19: return 11;
    case 21: return 5;
    case 23: return 17;
    case 25: return 25;
  }
  throw ('Number ' + x + ' is not invertible modulo 26');
}

// Returns two values in an array: the value to multiply b (or its row) by and
// the value to multiply a (or its row) by before subtracting it from b
function pickMultipliers(a, b) {
  if (invertible(a)) {
    return [1, b * invert(a)];
  } else {
    return [a, b];
  }
}

// If n may be negative, we have to use this, rather than %
function mod(n, m) {
  return ((n % m) + m) % m;
}

function multiplyRow(row, factor) {
  const len = row.length;
  for (let i = 0; i < len; i++) {
    row[i] = (row[i] * factor) % 26;
  }
}

function subtractRow(dst, src, factor) {
  const len = dst.length;
  for (let i = 0; i < len; i++) {
    dst[i] = mod(dst[i] - factor * src[i], 26);
  }
}

// Test whether just one value is non-zero in a row
function justOne(row) {
  const len = row.length;
  var found = false;
  var val;
  var idx;
  
  for (let i = 0; i < len; i++) {
    if (row[i] !== 0) {
      if (found) { return [false]; }
      else { found = true; val = row[i]; idx = i; }
    }
  }
  
  if (found) { return [found, val, idx]; }
  else { return [false]; }
}

// Tests whether all values in a row are zero
function allZeros(row) {
  const len = row.length;
  for (let i = 0; i < len; i++) {
    if (row[i] !== 0) { return false; }
  }
  return true;
}

// Solve for the variable x in ax = b (mod 26)
function solveForVariable(a, b) {
  if (invertible(a)) {
    return [true, (b * invert(a)) % 26];
  } else {
    var cnt = 0;
    var vals = [];
    for (let i = 0; i < 26; i++) {
      if ((a * i) % 26 === b) {
        vals[cnt] = i;
        cnt += 1;
      }
    }
    
    if (cnt === 1) { return [true, vals[0]]; }
    else { return [false]; }
  }
}

function varName(n) {
  switch (n) {
    case 0: return 'a';
    case 1: return 'b';
    case 2: return 'c';
    case 3: return 'd';
    case 4: return 'e';
    case 5: return 'f';
    case 6: return 'g';
    case 7: return 'h';
    case 8: return 'i';
    default: throw ('Variable number ' + n + ' is not allowed');
  }
}

function processSolve(lhs, rhs) {
  if (lhs.length === 0) {
    return "<tr><td>No Information Available</td></tr>";
  }
  
  var res = "";
  var someInfo = false;
  
  const nEqs = lhs.length;
  const nVars = lhs[0].length;
  for (let e = 0; e < nEqs; e++) {
    var varCnt = 0;
    var varIdx;
    var eq = "";
    
    for (let v = 0; v < nVars; v++) {
      if (lhs[e][v] !== 0) {
        if (varCnt !== 0) { eq = eq + " + "; }
        varCnt += 1;
        varIdx = v;
        
        if (lhs[e][v] === 1) {
          eq = eq + varName(v);
        } else {
          eq = eq + (lhs[e][v] + ' * ' + varName(v));
        }
      }
    }
    
    if (varCnt === 1 && lhs[e][varIdx] !== 1) {
      const coef = lhs[e][varIdx];
      const eqto = rhs[e];
      
      eq = eq + ' = ' + eqto;
      
      var vals = "";
      var first = true;
      for (let i = 0; i < 26; i++) {
        if ((i * coef) % 26 === eqto) {
          if (first) {
            vals = '' + i;
            first = false;
          } else {
            vals = vals + ', ' + i;
          }
        }
      }
      
      someInfo = true;
      res = res + ('<tr><td>' + eq + ' (mod 26) [' + vals + ']');
    } else if (varCnt === 1) {
      eq = eq + ' = ' + rhs[e];
      someInfo = true;
      res = res + ('<tr><td>' + eq + ' (autofilled into the key above)</td></tr>');
      document.getElementById('k' + varIdx).value = '' + rhs[e];
    } else if (varCnt >= 1) {
      eq = eq + ' = ' + rhs[e] + ' (mod 26)';
      
      someInfo = true;
      res = res + ('<tr><td>' + eq + '</td></tr>');
    }
  }
  
  if (!someInfo) { return "<tr><td>No Information Available</td></tr>"; }
  else { return res; }
}

// compares two coefficients for a pivot and picks the "best"; preference for
// any invertible element over a non-invertible one, after that just looking
// for smaller coefficients
function betterCoef(a, b) {
  const aInvert = invertible(a);
  const bInvert = invertible(b);
  if ((aInvert && bInvert) || (!aInvert && !bInvert)) { return a < b; }
  else { return aInvert; }
}

// Take the user-entered key and try to apply it
function decrypt() {
  document.getElementById("lenError").innerHTML = "";
  document.getElementById("valError").innerHTML = "";
  document.getElementById("keyError").innerHTML = "";
  document.getElementById("slvError").innerHTML = "";
  document.getElementById("decryptRes").innerHTML = "";
  
  var errKey = false;
  var missingKey = false;
  
  var cnt = 0;
  var key = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];
  
  for (let k = 0; k < 9; k++) {
    const val = document.getElementById("k" + k).value;
    if (val.length === 0) {
      missingKey = true;
    } else if (!isNumeric(val)) {
      errKey = true;
    } else if (val.length > 0) {
      key[Math.floor(k / 3)][k % 3] = parseInt(val, 10);
      cnt += 1;
    }
  }
  
  if (errKey) {
    document.getElementById("keyError").innerHTML = "Only numbers permitted in the key";
  } else if (missingKey) {
    document.getElementById("keyError").innerHTML = "Cannot decrypt without full key";
  } else {
    var res = "";
    
    const invertRes = invertMatrix(key);
    
    if (!invertRes[0]) {
      document.getElementById("keyError").innerHTML = "Key is not invertible";
    } else {
      const decrypt = invertRes[1];
      const k00 = decrypt[0][0];
      const k01 = decrypt[0][1];
      const k02 = decrypt[0][2];
      const k10 = decrypt[1][0];
      const k11 = decrypt[1][1];
      const k12 = decrypt[1][2];
      const k20 = decrypt[2][0];
      const k21 = decrypt[2][1];
      const k22 = decrypt[2][2];

      var indexNice = 0;
      for (let b = 0; b < bunches; b++) {
        const c0 = alphaToInt(justCipher.charAt(b * 3));
        const c1 = alphaToInt(justCipher.charAt(b*3+1));
        const c2 = alphaToInt(justCipher.charAt(b*3+2));
        
        const p0 = intToChar((k00 * c0 + k01 * c1 + k02 * c2) % 26);
        const p1 = intToChar((k10 * c0 + k11 * c1 + k12 * c2) % 26);
        const p2 = intToChar((k20 * c0 + k21 * c1 + k22 * c2) % 26);
        
        
        res += p0 + p1 + p2;
      }
      
      res = toTextForm(res);
      document.getElementById('decryptRes').innerHTML = res;
    }
  }
  
  window.scrollTo(0, document.body.scrollHeight);
}

function invertMatrix(mat) {
  if (mat.length !== 3 || mat[0].length !== 3) {
    throw 'invertMatrix() only works on 3x3 matrices';
  }
  
  const determinant = mat[0][0] * mat[1][1] * mat[2][2]
                    + mat[0][1] * mat[1][2] * mat[2][0]
                    + mat[0][2] * mat[1][0] * mat[2][1]
                    - mat[0][2] * mat[1][1] * mat[2][0]
                    - mat[0][1] * mat[1][0] * mat[2][2]
                    - mat[0][0] * mat[1][2] * mat[2][1];
  const det = mod(determinant, 26);
  
  if (!invertible(det)) {
    return [false];
  }
  
  const detInverse = invert(det);
  var res = [ [mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1],
               mat[0][2] * mat[2][1] - mat[0][1] * mat[2][2],
               mat[0][1] * mat[1][2] - mat[0][2] * mat[1][1] ],
              [mat[1][2] * mat[2][0] - mat[1][0] * mat[2][2],
               mat[0][0] * mat[2][2] - mat[0][2] * mat[2][0],
               mat[0][2] * mat[1][0] - mat[0][0] * mat[1][2]],
              [mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0],
               mat[0][1] * mat[2][0] - mat[0][0] * mat[2][1],
               mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]] ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      res[i][j] = mod(res[i][j] * detInverse, 26);
    }
  }
  
  return [true, res];
}

function intToChar(val) {
  return String.fromCharCode(97 + val);
}

function toTextForm(plaintext) {
  const plainLen = plaintext.length;
  
  var res = "";
  
  var textPos = 0;
  var cipherPos = 0;
  var plainPos = 0;
  
  while (textPos < len && cipherPos < cipherLen && plainPos < plainLen) {
    if (cipherText.charAt(textPos) == justCipher.charAt(cipherPos)) {
      if (cipherText.charAt(textPos) == cipherText.charAt(textPos).toUpperCase()) {
        res += plaintext.charAt(plainPos).toUpperCase();
      } else {
        res += plaintext.charAt(plainPos);
      }
      
      textPos += 1;
      cipherPos += 1;
      plainPos += 1;
    } else {
      res += cipherText.charAt(textPos);
      textPos += 1;
    }
  }
  
  return res;
}