import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchAllAnimals() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const apiKey = 'df6815561cf4a899227fd4363fe1ba79ae001e2e16c2d1f6289cf50373cd4080';
  
  try {
    console.log('Starting background data fetch...');
    
    // 첫 번째 요청으로 전체 데이터 개수 확인
    const firstUrl = `http://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2?serviceKey=${apiKey}&numOfRows=1&pageNo=1&_type=json`;
    const firstResponse = await fetch(firstUrl);
    const firstText = await firstResponse.text();
    
    let firstData;
    try {
      firstData = JSON.parse(firstText);
    } catch (parseError) {
      console.error('Failed to parse first response:', parseError);
      return;
    }

    const totalCount = firstData?.response?.body?.totalCount || 0;
    console.log(`Total animals available: ${totalCount}`);

    // 배치로 나눠서 가져오기
    const numOfRows = 1000;
    const totalPages = Math.ceil(totalCount / numOfRows);
    
    console.log(`Fetching ${totalPages} pages...`);

    for (let page = 1; page <= totalPages; page++) {
      try {
        const apiUrl = `http://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${page}&_type=json`;
        const response = await fetch(apiUrl);
        const xmlText = await response.text();

        let data;
        try {
          data = JSON.parse(xmlText);
        } catch (parseError) {
          console.error(`Failed to parse page ${page}:`, parseError);
          continue;
        }

        const items = data?.response?.body?.items?.item || [];
        const itemArray = Array.isArray(items) ? items : [items];
        
        // 첫 페이지 첫 아이템 로그 출력
        if (page === 1 && itemArray.length > 0) {
          console.log('Sample item from API:', JSON.stringify(itemArray[0], null, 2));
        }
        
        if (itemArray.length > 0) {
          const animals = itemArray.map((item: any) => ({
            desertionno: item.desertionNo,
            kindcd: item.kindFullNm || item.kindCd,
            colorcd: item.colorCd,
            age: item.age,
            weight: item.weight,
            sexcd: item.sexCd,
            neuteryn: item.neuterYn,
            specialmark: item.specialMark,
            carenm: item.careNm,
            caretel: item.careTel,
            careaddr: item.careAddr,
            happendt: item.happenDt,
            happenplace: item.happenPlace,
            noticesdt: item.noticeSdt,
            noticeedt: item.noticeEdt,
            popfile: item.popfile1 || item.popfile,
            processstate: item.processState,
          }));

          const { error } = await supabase
            .from('abandoned_animals')
            .upsert(animals, { onConflict: 'desertionno' });

          if (error) {
            console.error(`Error saving page ${page}:`, error);
          } else {
            console.log(`Saved page ${page}/${totalPages}: ${animals.length} items`);
          }
        }
      } catch (error) {
        console.error(`Error processing page ${page}:`, error);
      }
    }
    
    console.log('Background data fetch completed');
  } catch (error) {
    console.error('Background task error:', error);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 백그라운드에서 실행 (await 하지 않음)
    fetchAllAnimals().catch(error => {
      console.error('Background task failed:', error);
    });

    // 즉시 응답 반환
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '데이터 수집을 시작했습니다. 백그라운드에서 처리됩니다.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
