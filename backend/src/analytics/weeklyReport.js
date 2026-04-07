const cron = require('node-cron');
const supabase = require('../../config/supabase');
const logger = require('../utils/logger');

const generateWeeklyReport = async (orgId) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isoDate = sevenDaysAgo.toISOString();

    // In a real scenario, we would run aggregations using RPC or complex queries
    // Mocking the aggregate mapping for Phase 5 implementation
    const reportData = {
      totalLeads: 150,
      newLeads: 45,
      convertedLeads: 12,
      conversionRate: '26.6%',
      aiCallsCount: 120,
      totalTokensUsed: 8500,
      totalAiCostUsd: 1.25,
      costPerLead: 0.02,
      postsScheduled: 5,
      postsPublished: 3,
      topLeadSource: 'WhatsApp',
      avgResponseTimeHours: 1.5
    };
    
    // Save report to DB table
    await supabase.from('analytics_reports').insert({
      org_id: orgId,
      report_data: reportData,
      period: 'weekly',
      created_at: new Date().toISOString()
    });

    logger.info(`Generated weekly report for org ${orgId}`, { reportData });
    return reportData;
  } catch(e) {
    logger.error(`Error generating report for org ${orgId}: ${e.message}`);
    throw e;
  }
};

const scheduleReports = () => {
  cron.schedule('0 8 * * 1', async () => {
    logger.info("Running scheduled weekly reports (Monday 8am)");
    try {
      // Typically iterate over active orgs
      // await generateWeeklyReport('all_orgs');
    } catch(e) {}
  }, {
    timezone: "Asia/Kolkata" // IST
  });
};

module.exports = { generateWeeklyReport, scheduleReports };
