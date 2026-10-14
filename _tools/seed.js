const raw = localStorage.getItem('xinjie.uni.v1');
const st = raw ? JSON.parse(raw) : {};
st.authed = true;
st.phone = st.phone || '13800001234';
st.quiz = st.quiz || { k: 'deep', n: '静谧深海' };
st.unread = 3;
localStorage.setItem('xinjie.uni.v1', JSON.stringify(st));
location.reload();
' seeded';
