// lib/sheets/logger.ts
// Google Sheets 로깅 헬퍼

import { google } from 'googleapis'

// 🔧 변경 가능: Google Sheets 인증
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

// 🔧 변경 가능: 사용 로그 기록
export async function logToGoogleSheets(data: {
  userId: string
  email: string
  service: string
  action: string
  metadata?: any
}) {
  try {
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      console.warn('Google Sheets ID가 설정되지 않았습니다')
      return
    }

    const timestamp = new Date().toISOString()
    const row = [
      timestamp,
      data.userId,
      data.email,
      data.service,
      data.action,
      JSON.stringify(data.metadata || {}),
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Logs!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    })

    console.log('Google Sheets 로그 기록 완료')
  } catch (error) {
    console.error('Google Sheets 로그 기록 실패:', error)
  }
}

// 🔧 변경 가능: 에러 로그 기록
export async function logErrorToGoogleSheets(error: {
  userId?: string
  errorMessage: string
  errorStack?: string
  context?: string
}) {
  try {
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) return

    const timestamp = new Date().toISOString()
    const row = [
      timestamp,
      error.userId || 'anonymous',
      error.errorMessage,
      error.errorStack || '',
      error.context || '',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Errors!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    })
  } catch (err) {
    console.error('에러 로그 기록 실패:', err)
  }
}