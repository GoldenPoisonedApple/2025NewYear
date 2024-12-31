// 動的データ
const linkData = {
	url: "https://piccoma.com/web/product/29915?etype=episode",
	image: "https://piccoma.kakaocdn.net/dn/buYLTw/btsJFDsZ2rK/h5adVAC1udrT1vY0OOPKj0/cover_x2",
	title: "薬屋のひとりごと",
	description: "「小説家になろう」発！　ヒーロー文庫の大人気タイトル『薬屋のひとりごと』が、待望のコミカライズ！　中世の宮中で下働きをする少女・猫猫（マオマオ）。花街で薬師をやっていた彼女が、帝の御子たちが皆短命であるという噂を聞いてしまったところから、物語は動き始める。持ち前の好奇心と知識欲に突き動かされ、興味本位でその原因を調べ始める猫猫の運命は――…!? ※「小説家になろう」は株式会社ヒナプロジェクトの登録商標です。"
};

// HTML要素にデータをセット
document.getElementById("preview-image").src = linkData.image;
document.getElementById("preview-link").href = linkData.url;
document.getElementById("preview-link").textContent = linkData.title;
document.getElementById("preview-description").textContent = linkData.description;