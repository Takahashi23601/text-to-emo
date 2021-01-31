# -*- coding: utf-8 -*-
from flask import *
from flask_socketio import SocketIO
import MeCab
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import json
from flask import request, jsonify
import sys

def Text_Convert(text):
    x = np.array(0)
    try:
        #t = MeCab.Tagger("mecabrc")#デフォルト
        #t = MeCab.Tagger("-Owakati")#分かち書きのみを出力
        t = MeCab.Tagger("-Ochasen")#ChaSen 互換形式
        #t = MeCab.Tagger("-Oyomi")#読みのみを出力
        nouns = [line.split()[0] for line in t.parse(text).splitlines()
            if "名詞" or "動詞" in line.split()[-1]]
        for odd in nouns:
            if odd != '記号-空白':
                x = np.hstack([x,odd])
        return x

    except:
        return 0


app = Flask(__name__)
socketio = SocketIO(app, async_mode=None)

@app.route("/")
def init():
    return render_template('Text_To_Emo.html')


@app.route("/input", methods=["POST"])
def get_form():
    txt = request.json['data']
    Text = Text_Convert(txt)
    count = CountVectorizer()
    bag = count.fit_transform(Text)
    term_frequency = np.array(bag.sum(axis=0))[0]
    df = pd.DataFrame()
    for i in term_frequency.argsort()[:-1000:-1]:
        df = df.append([[count.get_feature_names()[i] , term_frequency[i]]],ignore_index = True)
    df.columns = ['単語','出現回数']
    df_pn = pd.read_csv('pn_ja.dic',delimiter=":", encoding='cp932',names=["単語","読み","品詞","感情値"])
    df_pn = df_pn.groupby(["単語","読み","品詞"],as_index=False).first().reset_index(drop=True)
    df_pn = df_pn.groupby(["単語"],as_index=False).first().reset_index(drop=True)
    df_emo = pd.merge(df,df_pn, on='単語')
    df_emo["合計感情値"] = df_emo["出現回数"] * df_emo["感情値"]

    return str(round(df_emo.sum().合計感情値/df_emo.sum().出現回数,5))

if __name__ == "__main__":
    # debugはデプロイ時にFalseにする
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=False)