const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data.json');

function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch(e) {}
  return { users: [], generations: [], cases: [] };
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// PG-compatible pool interface
const pool = {
  async query(sql, params = []) {
    const db = readDB();
    const upperSql = sql.trim().toUpperCase();
    
    // Simple SQL parsing for JSON store
    if (upperSql.startsWith('SELECT')) {
      if (sql.includes('FROM users')) {
        let rows = [...db.users];
        if (sql.includes('WHERE phone = ?')) rows = rows.filter(u => u.phone === params[0]);
        if (sql.includes('WHERE id = ?')) rows = rows.filter(u => u.id === params[0]);
        if (sql.includes('ORDER BY created_at DESC')) rows.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        if (sql.includes('LIMIT')) {
          const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
          if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]));
        }
        // Select specific columns
        if (sql.includes('id, phone, credits')) {
          rows = rows.map(u => ({ id: u.id, phone: u.phone, credits: u.credits, created_at: u.created_at }));
        }
        return { rows };
      }
      
      if (sql.includes('FROM generations')) {
        let rows = [...db.generations];
        if (sql.includes('WHERE user_id = ?')) rows = rows.filter(g => g.user_id === params[0]);
        if (sql.includes('ORDER BY created_at DESC')) rows.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        if (sql.includes('LIMIT')) {
          const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
          if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]));
        }
        return { rows };
      }
      
      if (sql.includes('FROM cases')) {
        let rows = [...db.cases];
        if (sql.includes('ORDER BY created_at DESC')) rows.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        if (sql.includes('LIMIT')) {
          const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
          if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]));
        }
        return { rows };
      }
      
      return { rows: [] };
    }
    
    if (upperSql.startsWith('INSERT')) {
      if (sql.includes('INTO users')) {
        const maxId = db.users.reduce((max, u) => Math.max(max, u.id || 0), 0);
        const user = {
          id: maxId + 1,
          phone: params[0],
          credits: params[1] || 10,
          token: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        db.users.push(user);
        writeDB(db);
        return { rows: [{ id: user.id }], lastID: user.id, changes: 1 };
      }
      
      if (sql.includes('INTO generations')) {
        const maxId = db.generations.reduce((max, g) => Math.max(max, g.id || 0), 0);
        const gen = {
          id: maxId + 1,
          user_id: params[0],
          product_name: params[1],
          tool_type: params[2],
          prompt: params[3],
          model: params[4],
          images: params[5],
          count: params[6],
          ratio: params[7],
          resolution: params[8],
          created_at: new Date().toISOString()
        };
        db.generations.push(gen);
        writeDB(db);
        return { rows: [], changes: 1 };
      }
      
      if (sql.includes('INTO cases')) {
        const maxId = db.cases.reduce((max, c) => Math.max(max, c.id || 0), 0);
        const c = {
          id: maxId + 1,
          title: params[0],
          description: params[1],
          image_url: params[2],
          category: params[3],
          created_at: new Date().toISOString()
        };
        db.cases.push(c);
        writeDB(db);
        return { rows: [], changes: 1 };
      }
    }
    
    if (upperSql.startsWith('UPDATE')) {
      if (sql.includes('users') && sql.includes('SET token')) {
        const user = db.users.find(u => u.id === params[1]);
        if (user) { user.token = params[0]; user.updated_at = new Date().toISOString(); }
        writeDB(db);
        return { rows: [], changes: 1 };
      }
      if (sql.includes('users') && sql.includes('SET credits')) {
        const user = db.users.find(u => u.id === params[1]);
        if (user) { user.credits = params[0]; user.updated_at = new Date().toISOString(); }
        writeDB(db);
        return { rows: [], changes: 1 };
      }
    }
    
    return { rows: [] };
  }
};

module.exports = pool;
