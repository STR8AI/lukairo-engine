import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

type Bindings = {
  DB: D1Database;
  VALUE_FROM_CLOUDFLARE: string;
  JWT_SECRET?: string;
};

type Variables = {
  user?: { id: string; email: string; role: string };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());

// ============================================
// DASHBOARD HOME
// ============================================
app.get('/', (c) =>
  c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LUKAIRO Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0c;
      color: #fff;
      min-height: 100vh;
      display: flex;
    }
    .sidebar {
      width: 240px;
      background: #111114;
      border-right: 1px solid #222;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
    }
    .logo {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 32px;
      color: #0ff;
      letter-spacing: 2px;
    }
    .nav { display: flex; flex-direction: column; gap: 8px; }
    .nav a {
      padding: 12px 14px;
      border-radius: 8px;
      color: #aaa;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s;
    }
    .nav a:hover, .nav a.active {
      background: #1a1a1f;
      color: #0ff;
    }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar {
      height: 64px;
      border-bottom: 1px solid #222;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      background: #111114;
    }
    .topbar h1 { font-size: 18px; font-weight: 600; }
    .status { color: #0f6; font-size: 13px; }
    .content { padding: 32px; overflow-y: auto; flex: 1; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: #151518;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 24px;
    }
    .stat-card h3 { color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: 700; color: #0ff; }
    .card {
      background: #151518;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .card h2 { font-size: 18px; margin-bottom: 16px; }
    .card p { color: #888; line-height: 1.6; }
    .endpoint {
      background: #0a0a0c;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 12px 16px;
      margin: 8px 0;
      font-family: monospace;
      font-size: 13px;
    }
    .endpoint .method { color: #0f6; margin-right: 12px; }
    .endpoint .path { color: #0af; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="logo">LUKAIRO</div>
    <div class="nav">
      <a href="/" class="active">Dashboard</a>
      <a href="/qualification">Qualification Engine</a>
      <a href="/workflows">Workflows</a>
      <a href="/integrations">Integrations</a>
      <a href="/analytics">Analytics</a>
    </div>
  </div>
  <div class="main">
    <div class="topbar">
      <h1>Dashboard</h1>
      <span class="status">● System Online</span>
    </div>
    <div class="content">
      <div class="stats">
        <div class="stat-card">
          <h3>Active Workflows</h3>
          <div class="value">12</div>
        </div>
        <div class="stat-card">
          <h3>Qualification Rules</h3>
          <div class="value">48</div>
        </div>
        <div class="stat-card">
          <h3>Integrations</h3>
          <div class="value">7</div>
        </div>
        <div class="stat-card">
          <h3>Events Today</h3>
          <div class="value">2.4K</div>
        </div>
      </div>
      <div class="card">
        <h2>API Endpoints</h2>
        <p>Available endpoints for the LUKAIRO Dashboard API:</p>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/health</span></div>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/orders</span></div>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/qualification/rules</span></div>
        <div class="endpoint"><span class="method">POST</span><span class="path">/api/qualification/evaluate</span></div>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/workflows</span></div>
        <div class="endpoint"><span class="method">POST</span><span class="path">/api/workflows</span></div>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/integrations</span></div>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/analytics/summary</span></div>
        <div class="endpoint"><span class="method">GET</span><span class="path">/api/analytics/events</span></div>
      </div>
    </div>
  </div>
</body>
</html>
  `)
);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    edge: c.env.VALUE_FROM_CLOUDFLARE || 'unknown',
  });
});

// ============================================
// ORDERS API
// ============================================
app.get('/api/orders', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT * FROM [Order] ORDER BY id DESC LIMIT 100'
    ).run();
    return c.json({ success: true, data: result.results, meta: result.meta });
  } catch (error) {
    return c.json({ success: false, error: 'Database query failed', details: String(error) }, 500);
  }
});

app.get('/api/orders/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await c.env.DB.prepare('SELECT * FROM [Order] WHERE id = ?').bind(id).first();
    if (!result) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Database query failed', details: String(error) }, 500);
  }
});

// ============================================
// QUALIFICATION ENGINE API
// ============================================
app.get('/qualification', (c) =>
  c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Qualification Engine - LUKAIRO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0c; color: #fff; min-height: 100vh; display: flex; }
    .sidebar { width: 240px; background: #111114; border-right: 1px solid #222; padding: 24px 20px; }
    .logo { font-size: 18px; font-weight: 700; margin-bottom: 32px; color: #0ff; letter-spacing: 2px; }
    .nav { display: flex; flex-direction: column; gap: 8px; }
    .nav a { padding: 12px 14px; border-radius: 8px; color: #aaa; text-decoration: none; font-size: 14px; }
    .nav a:hover, .nav a.active { background: #1a1a1f; color: #0ff; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar { height: 64px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 24px; background: #111114; }
    .topbar h1 { font-size: 18px; }
    .content { padding: 32px; flex: 1; }
    .card { background: #151518; border: 1px solid #222; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 18px; margin-bottom: 16px; }
    .card p { color: #888; line-height: 1.6; }
    .rule { background: #0a0a0c; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 12px 0; }
    .rule-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .rule-name { font-weight: 600; color: #0ff; }
    .rule-status { font-size: 12px; padding: 4px 8px; border-radius: 4px; }
    .rule-status.active { background: #0f62; color: #0f6; }
    .rule-status.inactive { background: #f002; color: #f66; }
    .rule-desc { color: #888; font-size: 13px; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="logo">LUKAIRO</div>
    <div class="nav">
      <a href="/">Dashboard</a>
      <a href="/qualification" class="active">Qualification Engine</a>
      <a href="/workflows">Workflows</a>
      <a href="/integrations">Integrations</a>
      <a href="/analytics">Analytics</a>
    </div>
  </div>
  <div class="main">
    <div class="topbar"><h1>Qualification Engine</h1></div>
    <div class="content">
      <div class="card">
        <h2>Qualification Rules</h2>
        <p>Define rules to automatically qualify leads, customers, and service requests.</p>
        <div class="rule">
          <div class="rule-header">
            <span class="rule-name">Enterprise Revenue Threshold</span>
            <span class="rule-status active">Active</span>
          </div>
          <div class="rule-desc">Qualify leads with ARR > $100,000</div>
        </div>
        <div class="rule">
          <div class="rule-header">
            <span class="rule-name">Employee Count Check</span>
            <span class="rule-status active">Active</span>
          </div>
          <div class="rule-desc">Qualify companies with 50+ employees</div>
        </div>
        <div class="rule">
          <div class="rule-header">
            <span class="rule-name">Industry Match</span>
            <span class="rule-status active">Active</span>
          </div>
          <div class="rule-desc">Target SaaS, FinTech, and Healthcare sectors</div>
        </div>
        <div class="rule">
          <div class="rule-header">
            <span class="rule-name">Geographic Filter</span>
            <span class="rule-status inactive">Inactive</span>
          </div>
          <div class="rule-desc">Restrict to North America and EU</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `)
);

app.get('/api/qualification/rules', async (c) => {
  // In production, fetch from DB
  const rules = [
    { id: 1, name: 'Enterprise Revenue Threshold', condition: 'arr > 100000', active: true, priority: 1 },
    { id: 2, name: 'Employee Count Check', condition: 'employees >= 50', active: true, priority: 2 },
    { id: 3, name: 'Industry Match', condition: 'industry IN (saas, fintech, healthcare)', active: true, priority: 3 },
    { id: 4, name: 'Geographic Filter', condition: 'region IN (NA, EU)', active: false, priority: 4 },
  ];
  return c.json({ success: true, data: rules });
});

app.post('/api/qualification/rules', async (c) => {
  try {
    const body = await c.req.json();
    const { name, condition, priority } = body;
    if (!name || !condition) {
      return c.json({ success: false, error: 'Name and condition are required' }, 400);
    }
    // In production, insert into DB
    const newRule = { id: Date.now(), name, condition, active: true, priority: priority || 99 };
    return c.json({ success: true, data: newRule }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Invalid request body' }, 400);
  }
});

app.post('/api/qualification/evaluate', async (c) => {
  try {
    const body = await c.req.json();
    const { lead } = body;
    if (!lead) {
      return c.json({ success: false, error: 'Lead data is required' }, 400);
    }
    // Simple evaluation logic
    const qualifications = [];
    if (lead.arr && lead.arr > 100000) qualifications.push('enterprise_revenue');
    if (lead.employees && lead.employees >= 50) qualifications.push('employee_count');
    if (lead.industry && ['saas', 'fintech', 'healthcare'].includes(lead.industry.toLowerCase())) qualifications.push('industry_match');

    const qualified = qualifications.length >= 2;
    return c.json({
      success: true,
      data: {
        qualified,
        score: qualifications.length * 33,
        matchedRules: qualifications,
        evaluatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Evaluation failed' }, 500);
  }
});

// ============================================
// WORKFLOWS API
// ============================================
app.get('/workflows', (c) =>
  c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Workflows - LUKAIRO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0c; color: #fff; min-height: 100vh; display: flex; }
    .sidebar { width: 240px; background: #111114; border-right: 1px solid #222; padding: 24px 20px; }
    .logo { font-size: 18px; font-weight: 700; margin-bottom: 32px; color: #0ff; letter-spacing: 2px; }
    .nav { display: flex; flex-direction: column; gap: 8px; }
    .nav a { padding: 12px 14px; border-radius: 8px; color: #aaa; text-decoration: none; font-size: 14px; }
    .nav a:hover, .nav a.active { background: #1a1a1f; color: #0ff; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar { height: 64px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 24px; background: #111114; }
    .topbar h1 { font-size: 18px; }
    .content { padding: 32px; flex: 1; }
    .workflow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .workflow-card { background: #151518; border: 1px solid #222; border-radius: 12px; padding: 24px; }
    .workflow-card h3 { color: #0ff; margin-bottom: 8px; }
    .workflow-card p { color: #888; font-size: 14px; margin-bottom: 16px; }
    .workflow-meta { display: flex; gap: 16px; font-size: 12px; color: #666; }
    .workflow-status { padding: 4px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase; }
    .workflow-status.running { background: #0f62; color: #0f6; }
    .workflow-status.paused { background: #ff02; color: #fa0; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="logo">LUKAIRO</div>
    <div class="nav">
      <a href="/">Dashboard</a>
      <a href="/qualification">Qualification Engine</a>
      <a href="/workflows" class="active">Workflows</a>
      <a href="/integrations">Integrations</a>
      <a href="/analytics">Analytics</a>
    </div>
  </div>
  <div class="main">
    <div class="topbar"><h1>Workflows</h1></div>
    <div class="content">
      <div class="workflow-grid">
        <div class="workflow-card">
          <h3>Lead Routing</h3>
          <p>Automatically route qualified leads to the appropriate sales team based on territory and deal size.</p>
          <div class="workflow-meta">
            <span class="workflow-status running">Running</span>
            <span>1,247 executions</span>
          </div>
        </div>
        <div class="workflow-card">
          <h3>Onboarding Sequence</h3>
          <p>Multi-step onboarding flow with email triggers, task creation, and success milestone tracking.</p>
          <div class="workflow-meta">
            <span class="workflow-status running">Running</span>
            <span>892 executions</span>
          </div>
        </div>
        <div class="workflow-card">
          <h3>Renewal Reminder</h3>
          <p>Automated renewal notifications sent 90, 60, and 30 days before contract expiration.</p>
          <div class="workflow-meta">
            <span class="workflow-status running">Running</span>
            <span>456 executions</span>
          </div>
        </div>
        <div class="workflow-card">
          <h3>Churn Prevention</h3>
          <p>Trigger intervention when usage drops or negative sentiment is detected.</p>
          <div class="workflow-meta">
            <span class="workflow-status paused">Paused</span>
            <span>234 executions</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `)
);

app.get('/api/workflows', async (c) => {
  const workflows = [
    { id: 1, name: 'Lead Routing', status: 'running', executions: 1247, trigger: 'lead.qualified', createdAt: '2025-01-15' },
    { id: 2, name: 'Onboarding Sequence', status: 'running', executions: 892, trigger: 'customer.created', createdAt: '2025-01-20' },
    { id: 3, name: 'Renewal Reminder', status: 'running', executions: 456, trigger: 'schedule.daily', createdAt: '2025-02-01' },
    { id: 4, name: 'Churn Prevention', status: 'paused', executions: 234, trigger: 'usage.drop', createdAt: '2025-02-05' },
  ];
  return c.json({ success: true, data: workflows });
});

app.post('/api/workflows', async (c) => {
  try {
    const body = await c.req.json();
    const { name, trigger, steps } = body;
    if (!name || !trigger) {
      return c.json({ success: false, error: 'Name and trigger are required' }, 400);
    }
    const newWorkflow = {
      id: Date.now(),
      name,
      trigger,
      steps: steps || [],
      status: 'paused',
      executions: 0,
      createdAt: new Date().toISOString(),
    };
    return c.json({ success: true, data: newWorkflow }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Invalid request body' }, 400);
  }
});

app.post('/api/workflows/:id/execute', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    return c.json({
      success: true,
      data: {
        executionId: `exec_${Date.now()}`,
        workflowId: id,
        status: 'started',
        input: body,
        startedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Execution failed' }, 500);
  }
});

// ============================================
// INTEGRATIONS API
// ============================================
app.get('/integrations', (c) =>
  c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Integrations - LUKAIRO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0c; color: #fff; min-height: 100vh; display: flex; }
    .sidebar { width: 240px; background: #111114; border-right: 1px solid #222; padding: 24px 20px; }
    .logo { font-size: 18px; font-weight: 700; margin-bottom: 32px; color: #0ff; letter-spacing: 2px; }
    .nav { display: flex; flex-direction: column; gap: 8px; }
    .nav a { padding: 12px 14px; border-radius: 8px; color: #aaa; text-decoration: none; font-size: 14px; }
    .nav a:hover, .nav a.active { background: #1a1a1f; color: #0ff; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar { height: 64px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 24px; background: #111114; }
    .topbar h1 { font-size: 18px; }
    .content { padding: 32px; flex: 1; }
    .integration-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .integration-card { background: #151518; border: 1px solid #222; border-radius: 12px; padding: 24px; display: flex; gap: 16px; align-items: flex-start; }
    .integration-icon { width: 48px; height: 48px; background: #222; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .integration-info h3 { margin-bottom: 4px; }
    .integration-info p { color: #888; font-size: 13px; margin-bottom: 8px; }
    .integration-status { font-size: 12px; }
    .integration-status.connected { color: #0f6; }
    .integration-status.disconnected { color: #666; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="logo">LUKAIRO</div>
    <div class="nav">
      <a href="/">Dashboard</a>
      <a href="/qualification">Qualification Engine</a>
      <a href="/workflows">Workflows</a>
      <a href="/integrations" class="active">Integrations</a>
      <a href="/analytics">Analytics</a>
    </div>
  </div>
  <div class="main">
    <div class="topbar"><h1>Integrations</h1></div>
    <div class="content">
      <div class="integration-grid">
        <div class="integration-card">
          <div class="integration-icon">📊</div>
          <div class="integration-info">
            <h3>Salesforce</h3>
            <p>CRM sync for leads, accounts, and opportunities</p>
            <span class="integration-status connected">● Connected</span>
          </div>
        </div>
        <div class="integration-card">
          <div class="integration-icon">📧</div>
          <div class="integration-info">
            <h3>SendGrid</h3>
            <p>Transactional and marketing email delivery</p>
            <span class="integration-status connected">● Connected</span>
          </div>
        </div>
        <div class="integration-card">
          <div class="integration-icon">💬</div>
          <div class="integration-info">
            <h3>Slack</h3>
            <p>Team notifications and workflow alerts</p>
            <span class="integration-status connected">● Connected</span>
          </div>
        </div>
        <div class="integration-card">
          <div class="integration-icon">📈</div>
          <div class="integration-info">
            <h3>Mixpanel</h3>
            <p>Product analytics and event tracking</p>
            <span class="integration-status connected">● Connected</span>
          </div>
        </div>
        <div class="integration-card">
          <div class="integration-icon">💳</div>
          <div class="integration-info">
            <h3>Stripe</h3>
            <p>Payment processing and subscription management</p>
            <span class="integration-status connected">● Connected</span>
          </div>
        </div>
        <div class="integration-card">
          <div class="integration-icon">🔗</div>
          <div class="integration-info">
            <h3>Zapier</h3>
            <p>Connect to 5000+ apps via automation</p>
            <span class="integration-status disconnected">○ Not Connected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `)
);

app.get('/api/integrations', async (c) => {
  const integrations = [
    { id: 1, name: 'Salesforce', type: 'crm', status: 'connected', lastSync: '2026-02-10T10:30:00Z' },
    { id: 2, name: 'SendGrid', type: 'email', status: 'connected', lastSync: '2026-02-10T11:00:00Z' },
    { id: 3, name: 'Slack', type: 'notifications', status: 'connected', lastSync: '2026-02-10T11:15:00Z' },
    { id: 4, name: 'Mixpanel', type: 'analytics', status: 'connected', lastSync: '2026-02-10T09:00:00Z' },
    { id: 5, name: 'Stripe', type: 'payments', status: 'connected', lastSync: '2026-02-10T08:45:00Z' },
    { id: 6, name: 'Zapier', type: 'automation', status: 'disconnected', lastSync: null },
  ];
  return c.json({ success: true, data: integrations });
});

app.post('/api/integrations/:id/sync', async (c) => {
  const id = c.req.param('id');
  return c.json({
    success: true,
    data: {
      integrationId: id,
      syncId: `sync_${Date.now()}`,
      status: 'started',
      startedAt: new Date().toISOString(),
    },
  });
});

// ============================================
// ANALYTICS API
// ============================================
app.get('/analytics', (c) =>
  c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Analytics - LUKAIRO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0c; color: #fff; min-height: 100vh; display: flex; }
    .sidebar { width: 240px; background: #111114; border-right: 1px solid #222; padding: 24px 20px; }
    .logo { font-size: 18px; font-weight: 700; margin-bottom: 32px; color: #0ff; letter-spacing: 2px; }
    .nav { display: flex; flex-direction: column; gap: 8px; }
    .nav a { padding: 12px 14px; border-radius: 8px; color: #aaa; text-decoration: none; font-size: 14px; }
    .nav a:hover, .nav a.active { background: #1a1a1f; color: #0ff; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar { height: 64px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 24px; background: #111114; }
    .topbar h1 { font-size: 18px; }
    .content { padding: 32px; flex: 1; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
    .metric-card { background: #151518; border: 1px solid #222; border-radius: 12px; padding: 24px; }
    .metric-card h3 { color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
    .metric-card .value { font-size: 28px; font-weight: 700; color: #0ff; }
    .metric-card .change { font-size: 12px; margin-top: 4px; }
    .metric-card .change.positive { color: #0f6; }
    .metric-card .change.negative { color: #f66; }
    .chart-container { background: #151518; border: 1px solid #222; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .chart-container h3 { margin-bottom: 16px; }
    .chart-placeholder { height: 200px; background: linear-gradient(135deg, #0ff1 0%, #0af1 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; }
    .events-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .events-table th, .events-table td { padding: 12px; text-align: left; border-bottom: 1px solid #222; }
    .events-table th { color: #888; font-size: 12px; text-transform: uppercase; }
    .events-table td { font-size: 14px; }
    .event-type { padding: 4px 8px; border-radius: 4px; font-size: 11px; background: #0af2; color: #0af; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="logo">LUKAIRO</div>
    <div class="nav">
      <a href="/">Dashboard</a>
      <a href="/qualification">Qualification Engine</a>
      <a href="/workflows">Workflows</a>
      <a href="/integrations">Integrations</a>
      <a href="/analytics" class="active">Analytics</a>
    </div>
  </div>
  <div class="main">
    <div class="topbar"><h1>Analytics</h1></div>
    <div class="content">
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Events</h3>
          <div class="value">48.2K</div>
          <div class="change positive">↑ 12.5% vs last week</div>
        </div>
        <div class="metric-card">
          <h3>Qualified Leads</h3>
          <div class="value">1,247</div>
          <div class="change positive">↑ 8.3% vs last week</div>
        </div>
        <div class="metric-card">
          <h3>Conversion Rate</h3>
          <div class="value">24.6%</div>
          <div class="change negative">↓ 2.1% vs last week</div>
        </div>
        <div class="metric-card">
          <h3>Avg Response Time</h3>
          <div class="value">1.4s</div>
          <div class="change positive">↑ 15% faster</div>
        </div>
      </div>
      <div class="chart-container">
        <h3>Events Over Time</h3>
        <div class="chart-placeholder">📊 Chart visualization would render here</div>
      </div>
      <div class="chart-container">
        <h3>Recent Events</h3>
        <table class="events-table">
          <thead>
            <tr><th>Timestamp</th><th>Event Type</th><th>Source</th><th>Details</th></tr>
          </thead>
          <tbody>
            <tr><td>11:42:31</td><td><span class="event-type">lead.qualified</span></td><td>Qualification Engine</td><td>Lead #4821 scored 87/100</td></tr>
            <tr><td>11:41:15</td><td><span class="event-type">workflow.executed</span></td><td>Lead Routing</td><td>Assigned to sales-west</td></tr>
            <tr><td>11:40:02</td><td><span class="event-type">integration.sync</span></td><td>Salesforce</td><td>42 records updated</td></tr>
            <tr><td>11:38:47</td><td><span class="event-type">email.sent</span></td><td>SendGrid</td><td>Welcome sequence #3</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>
  `)
);

app.get('/api/analytics/summary', async (c) => {
  const summary = {
    period: 'last_7_days',
    metrics: {
      totalEvents: 48234,
      qualifiedLeads: 1247,
      conversionRate: 0.246,
      avgResponseTime: 1.4,
      workflowExecutions: 3421,
      activeIntegrations: 5,
    },
    trends: {
      events: { current: 48234, previous: 42876, change: 0.125 },
      leads: { current: 1247, previous: 1151, change: 0.083 },
      conversion: { current: 0.246, previous: 0.251, change: -0.021 },
    },
  };
  return c.json({ success: true, data: summary });
});

app.get('/api/analytics/events', async (c) => {
  const limit = Number(c.req.query('limit')) || 50;
  const type = c.req.query('type');

  const events = [
    { id: 1, type: 'lead.qualified', source: 'qualification_engine', timestamp: '2026-02-10T11:42:31Z', data: { leadId: 4821, score: 87 } },
    { id: 2, type: 'workflow.executed', source: 'lead_routing', timestamp: '2026-02-10T11:41:15Z', data: { workflowId: 1, assignee: 'sales-west' } },
    { id: 3, type: 'integration.sync', source: 'salesforce', timestamp: '2026-02-10T11:40:02Z', data: { recordsUpdated: 42 } },
    { id: 4, type: 'email.sent', source: 'sendgrid', timestamp: '2026-02-10T11:38:47Z', data: { template: 'welcome_3' } },
    { id: 5, type: 'lead.created', source: 'api', timestamp: '2026-02-10T11:35:12Z', data: { leadId: 4822 } },
  ];

  const filtered = type ? events.filter((e) => e.type === type) : events;
  return c.json({ success: true, data: filtered.slice(0, limit), meta: { total: filtered.length, limit } });
});

app.post('/api/analytics/events', async (c) => {
  try {
    const body = await c.req.json();
    const { type, source, data } = body;
    if (!type) {
      return c.json({ success: false, error: 'Event type is required' }, 400);
    }
    const event = {
      id: Date.now(),
      type,
      source: source || 'api',
      timestamp: new Date().toISOString(),
      data: data || {},
    };
    return c.json({ success: true, data: event }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Invalid request body' }, 400);
  }
});

// ============================================
// 404 Handler
// ============================================
app.notFound((c) => {
  return c.json({ success: false, error: 'Not found' }, 404);
});

// ============================================
// Error Handler
// ============================================
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ success: false, error: 'Internal server error' }, 500);
});

export default app;
