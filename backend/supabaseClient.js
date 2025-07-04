// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oieynyzuxbkknifhadzi.supabase.co';  // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZXlueXp1eGJra25pZmhhZHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2Mzc5NDcsImV4cCI6MjA2NzIxMzk0N30.dxhLZioqeF95kQGX8N-qtioYZ1FIJRC1n8qey3mO1r0';                 // Replace with your anon/public API key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
