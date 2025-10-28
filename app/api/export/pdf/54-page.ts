// app/api/export/pdf/route.ts
// PDF 리포트 생성 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data, title } = body

    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    // 🔧 변경 가능: PDF 생성 로직
    // 실제 환경에서는 puppeteer, jsPDF 등의 라이브러리 사용 필요
    // 여기서는 HTML 템플릿을 반환하는 예시

    let htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || '리포트'}</title>
        <style>
          body {
            font-family: 'Malgun Gothic', sans-serif;
            padding: 40px;
            line-height: 1.6;
          }
          h1 {
            color: #1F2937;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #E5E7EB;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #F3F4F6;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>${title || '키워드 분석 리포트'}</h1>
        <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
    `

    // 🔧 변경 가능: 타입별 테이블 생성
    if (type === 'keywords' && data) {
      htmlContent += `
        <table>
          <thead>
            <tr>
              <th>키워드</th>
              <th>검색량</th>
              <th>경쟁도</th>
              <th>CPC</th>
              <th>플랫폼</th>
            </tr>
          </thead>
          <tbody>
      `
      
      data.forEach((keyword: any) => {
        htmlContent += `
          <tr>
            <td>${keyword.keyword}</td>
            <td>${keyword.search_volume?.toLocaleString() || 'N/A'}</td>
            <td>${keyword.competition || 'N/A'}</td>
            <td>${keyword.cpc ? keyword.cpc + '원' : 'N/A'}</td>
            <td>${keyword.platform || 'N/A'}</td>
          </tr>
        `
      })

      htmlContent += `
          </tbody>
        </table>
      `
    }

    htmlContent += `
        <div class="footer">
          <p>이 리포트는 키워드 분석 서비스에서 생성되었습니다.</p>
        </div>
      </body>
      </html>
    `

    // HTML 반환 (클라이언트에서 window.print() 사용 또는 puppeteer로 PDF 변환)
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })

    // 🔧 변경 가능: 실제 PDF 파일로 변환하려면 puppeteer 사용
    // const browser = await puppeteer.launch()
    // const page = await browser.newPage()
    // await page.setContent(htmlContent)
    // const pdfBuffer = await page.pdf({ format: 'A4' })
    // await browser.close()
    // 
    // return new NextResponse(pdfBuffer, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="report_${Date.now()}.pdf"`,
    //   },
    // })

  } catch (error: any) {
    console.error('PDF 생성 오류:', error)
    return NextResponse.json(
      { error: error.message || 'PDF 생성 실패' },
      { status: 500 }
    )
  }
}