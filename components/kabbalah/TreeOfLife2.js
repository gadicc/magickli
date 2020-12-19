import React from "react";
import dotProp from 'dot-prop';

import Data from '../../data/data';
const _sephirot = Object.values(Data.sephirah);

function TreeOfLife({ width, height, labels, colorScale, field, topText = 'index', active }) {
  const color = colorScale ? (colorScale+'Web') : 'queenWeb';
  width = width || '100%';
  field = field || 'index';

  if (!labels)
    labels = [0,1,2,3,4,5,6,7,8,9].map(i => dotProp.get(_sephirot[i], field));

  topText = [0,1,2,3,4,5,6,7,8,9].map(i => dotProp.get(_sephirot[i], topText));

  const fontSizeFromFieldName = {
    'index': 32,
    'name.en': 10,
    'name.he': 20,
    'name.romanization': 12,
    'godName.name.he': 20,
  };
  const fontSize = fontSizeFromFieldName[field] || 10;

  const pillar = [
    { name: 'severity', x: 47 },
    { name: 'equilibrium', x: 158 },
    { name: 'mercy', x: 269.5 },
  ];

  const rowStart = 55.5;
  const rowGap = 64;

  const sephirot = [
    { x: pillar[1].x, y: rowStart+rowGap*0, data: _sephirot[0], color: _sephirot[0].color[color], text: labels[0], textColor: _sephirot[0].color[color+'Text'] },
    { x: pillar[2].x, y: rowStart+rowGap*1, data: _sephirot[1], color: _sephirot[1].color[color], text: labels[1], textColor: _sephirot[1].color[color+'Text'] },
    { x: pillar[0].x, y: rowStart+rowGap*1, data: _sephirot[2], color: _sephirot[2].color[color], text: labels[2], textColor: _sephirot[2].color[color+'Text'] },
    { x: pillar[2].x, y: rowStart+rowGap*3, data: _sephirot[3], color: _sephirot[3].color[color], text: labels[3], textColor: _sephirot[3].color[color+'Text'] },
    { x: pillar[0].x, y: rowStart+rowGap*3, data: _sephirot[4], color: _sephirot[4].color[color], text: labels[4], textColor: _sephirot[4].color[color+'Text'] },
    { x: pillar[1].x, y: rowStart+rowGap*4, data: _sephirot[5], color: _sephirot[5].color[color], text: labels[5], textColor: _sephirot[5].color[color+'Text'] },
    { x: pillar[2].x, y: rowStart+rowGap*5, data: _sephirot[6], color: _sephirot[6].color[color], text: labels[6], textColor: _sephirot[6].color[color+'Text'] },
    { x: pillar[0].x, y: rowStart+rowGap*5, data: _sephirot[7], color: _sephirot[7].color[color], text: labels[7], textColor: _sephirot[7].color[color+'Text'] },
    { x: pillar[1].x, y: rowStart+rowGap*6, data: _sephirot[8], color: _sephirot[8].color[color], text: labels[8], textColor: _sephirot[8].color[color+'Text'] },
    { x: pillar[1].x, y: rowStart+rowGap*8, data: _sephirot[9], color: _sephirot[9].color[color], text: labels[9], textColor: _sephirot[9].color[color+'Text'] },
  ];

  const pathOpacity = active ? 0.1 : 1;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      version="1.1"
      viewBox="0 0 316 600"
    >
      <g
        fill="none"
        stroke="#000"
        strokeWidth="51.8"
        opacity={pathOpacity}
        transform="matrix(.392 0 0 -.392 158 300)"
      >
        <path d="M0 653.561l-283-163.39"></path>
        <path
          stroke="#fff"
          strokeWidth="43.8"
          d="M0 653.561l-283-163.39"
        ></path>
        <path d="M0 653.561l283-163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 653.561l283-163.39"></path>
        <path d="M0 0l283 490.17"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 0l283 490.17"></path>
        <path d="M0 0l-283 490.17"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 0l-283 490.17"></path>
        <path d="M-283 490.17l566-326.78"></path>
        <path
          stroke="#fff"
          strokeWidth="43.8"
          d="M-283 490.17l566-326.78"
        ></path>
        <path d="M283 490.17l-566-326.78"></path>
        <path
          stroke="#fff"
          strokeWidth="43.8"
          d="M283 490.17l-566-326.78"
        ></path>
        <path d="M0 0l283 163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 0l283 163.39"></path>
        <path d="M0 0l-283 163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 0l-283 163.39"></path>
        <path d="M0 0l283-163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 0l283-163.39"></path>
        <path d="M0 0l-283-163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 0l-283-163.39"></path>
        <path d="M0-326.78l283 163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0-326.78l283 163.39"></path>
        <path d="M0-326.78l-283 163.39"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0-326.78l-283 163.39"></path>
        <path d="M283 490.17v-653.561"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M283 490.17v-653.561"></path>
        <path d="M-283 490.17v-653.561"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M-283 490.17v-653.561"></path>
        <path d="M0 653.561v-1307.12"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M0 653.561v-1307.12"></path>
        <path d="M283 490.17h-566"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M283 490.17h-566"></path>
        <path d="M283 163.39h-566"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M283 163.39h-566"></path>
        <path d="M283-163.39h-566"></path>
        <path stroke="#fff" strokeWidth="43.8" d="M283-163.39h-566"></path>
      </g>
      {
        sephirot.map((s,i) => (
          <React.Fragment key={i}>
            <a xlinkHref={"/kabbalah/sephirah/"+s.data.id}>
              <circle
                cx={s.x}
                cy={s.y-11}
                r="39.2"
                fill={s.color.match(',') ? null : s.color}
                stroke="#000"
                strokeWidth="1.568"
                opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
              ></circle>

              {
                // Currently has fixed positions for Malkuth though.
                s.color.match(',') ? (
                  <>
                    <path
                       id="circle88-7"
                       style={{fill:s.color.split(',')[0],stroke:'#000000',strokeWidth:1.568 }}
                       opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                       d="m 158,556.5 -27.71859,-27.71859 c -15.30855,15.30855 -15.30855,40.12863 0,55.43718 z" />
                    <path
                       id="circle88-1"
                       style={{fill:s.color.split(',')[1],stroke:'#000000',strokeWidth:1.568 }}
                       opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                       d="m 185.5,529 c -15.30855,-15.30855 -40.12863,-15.30855 -55.43718,0 L 158,556.5 Z" />
                    <path
                       id="circle88-10"
                       style={{fill:s.color.split(',')[2],stroke:'#000000',strokeWidth:1.568 }}
                       opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                       d="m 158,556.5 27.71859,27.71859 c 15.30855,-15.30855 15.30855,-40.12863 0,-55.43718 z" />
                    <path
                       id="circle88-2"
                       style={{fill:s.color.split(',')[3],stroke:'#000000',strokeWidth:1.568 }}
                       opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                       d="m 158,556.5 -27.71859,27.71859 c 15.30855,15.30855 40.12863,15.30855 55.43718,0 z" />
                  </>

                ) : null
              }

              <text key={i}
                x={s.x}
                y={s.y}
                fill={s.textColor || 'black'}
                fillOpacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                stroke="none"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeOpacity="1"
                strokeWidth="0.8"
                fontFamily="Sans"
                fontSize={fontSize}
                fontStyle="normal"
                fontWeight="normal"
                letterSpacing="0"
                wordSpacing="0"
                xmlSpace="preserve"
              >
                <tspan
                  style={{ WebkitTextAlign: "center", textAlign: "center" }}
                  x={s.x}
                  // for 12 it's 8
                  // for 32 it's 3
                  y={s.y-12}
                  strokeWidth="0.8"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  { s.text }
                </tspan>
              </text>

              <path
                 d={"M "
                  + (s.x - 27) + ","
                  + (s.y - 14) + " c 1.5,-34 56.5,-34 58,0"}
                 transform="rotate(29)"
                 style={{
                   transformBox: 'fill-box', transformOrigin:"50% 100%",
                   fill:'none',stroke:'none'}}
                 id={"ic"+i} />

              <text
                 y="0"
                 x="26.8589"
                 id="text923"
                 style={{
                    fontStyle:'normal', fontWeight:'normal', fontSize:'10px', fontFamily:'Sans',
                    letterSpacing:'-1.5px', wordSpacing:'0px',
                    fill:s.textColor||'black',
                    fillOpacity: (!active || (active && active===s.data.id)) ? 1 : 0.1,
                    stroke:'none',strokeWidth:'0.8px',strokeLinecap:'butt',strokeLinejoin:'miter',strokeOpacity:1}}
                 xmlSpace="preserve"><textPath
                   style={{textAlign:'center',textAnchor:'middle'}}
                   id="textPath945"
                   xlinkHref={"#ic"+i}>{topText[i]}</textPath></text>

            </a>
          </React.Fragment>
        ))
      }

      <g opacity={pathOpacity}>
        <path
          strokeWidth="0.392"
          d="M161.042 166.328h-5.57c-2.007 0-1.204-1.063-1.204-1.063-1.756.903-1.907 3.964 1.204 3.964h4.416c1.806 0 .542.602.542 1.756v7.476c0 1.606 1.45.402 1.45 0v-7.225c0-1.505 2.975-4.908-.838-4.908z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M101.513 73.21c0-1.856-1.545-1.746-1.545-1.746h-.3c-2.007 0-1.255-.963-1.255-.963-1.706.853-1.806 3.864.401 3.864 0 0 1.248-.15 1.248 1.405v7.827c0 1.606 1.45.402 1.45 0z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M208.411 81.113c0 1.507 1.411.39 1.411 0v-4.909c0-1.507-1.41-.389-1.41 0zm5.88-8.943c.049 0 1.176-.146 1.176 1.263v7.68c0 1.507 1.411.39 1.411 0-.01 0 0-4.715 0-7.68 0-1.41.913-1.506.913-2.722 0-.68-.34-1.364-.973-1.364h-6.95c-1.945 0-1.167-1.017-1.167-1.017-1.701.875-1.847 3.84 1.02 3.84z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M159.204 111.282h-.903c-.301 0-.803-.452-.552-.954 1.154-2.559 3.01-8.028 1.556-8.78-.552-.301-1.154-.1-1.305-1.255-1.756.853-1.907 3.814.301 3.814 0 0-1.706 7.175-3.312 7.175-.702 0-1.116-.903-1.116-1.606v-1.756c0-1.907 2.873-5.369 1.016-6.372-.602-.301-1.154-.1-1.355-1.255-1.706.853-1.906 3.814.301 3.814 0 0-1.362 2.559-1.362 3.964v3.863c0 2.158 1.563 2.258 1.563 2.258h5.218c1.857 0 6.272-11.892 4.817-12.644-.552-.301-1.505-.1-1.706-1.255-1.706.853-1.857 3.814.301 3.814 0 0-1.756 7.175-3.462 7.175z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M107.275 151.542c0 1.264 1.411.326 1.411 0v-7.848c0-1.223-1.41-.285-1.41 0zm7.723-8.52c0 1.14-3.933 3.18-3.933 4.484 0 1.59 1.264 1.59 1.264 0 0-1.06 4.08-3.099 4.08-4.485v-2.63c0-2.262-2.184-2.209-2.184-2.209h-5.493c-1.944 0-1.215-.826-1.167-.868-1.701.734-1.847 3.22 1.167 3.22h4.448s1.818-.122 1.818 1.774z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M202.694 145.532c.502-.327 2.283-3.782-1.781-3.782l-.326-.032c-1.756 0-1.957-.476-2.183-.852-.476.3-1.982 3.461 1.355 3.738-1.43 2.659.579 4.666.303 9.357 0 1.556 1.136.402 1.136 0 1.08-4.285-1.238-7.041-.26-9.296 1.556.05 1.556.495 1.756.867z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M88.616 170.849c.017-.778 0-1.313 0-2.09 1.02 0 1.524-2.823-.858-2.823h-.243c-1.944 0-1.215-.969-1.215-.969-1.847 1.361-1.652 3.728.924 3.777 0 0-.019.539-.019 1.813 0 1.36-.963 2.43-1.974 3.11-1.653-1.36-2.769-2.138-2.769-2.867-.002-.778 0-1.264 0-2.042 2.042 0 2.137-2.822-.245-2.822h-.243c-1.944 0-1.215-.92-1.215-.92-1.653.826-1.798 3.742.292 3.742v2.334c0 1.798 1.264 2.236 2.333 3.305 0 0-2.187.826-3.597 1.458-1.215.486-.875 2.625.68 2.625 0 0 8.15-1.555 8.15-7.631z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M232.687 170c-.2.452.351.753.502.251.602-1.656 1.053-1.806 1.505-1.806 0 0 1.04-.2 1.04 2.057v.301c0 1.204-1.65 4.767-3.65 4.767h-2.107s-1.417.05-1.417-1.305v-2.609c0-1.054.356-1.003.815-1.505.15.05.753.401.652 1.204.903-.301 1.455-.903 1.455-1.756 0-1.204.201-1.505-.752-2.459-.653-.652-1.556-.953-1.706-2.559-.552.703-1.212.954-1.212 2.459 0 1.455.254 1.254.76 2.107-.903.954-1.462 1.455-1.462 2.51v3.913c0 1.906 1.56 2.91 2.466 2.91h2.559c3.06 0 5.049-4.817 5.049-7.677v-3.512c0-1.857-1.537-1.747-1.537-1.747h-1.756s-.588.05-.588.693c0 .602.137 1.606-.616 3.763z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M48.162 174.84v-6.373c0-1.857-1.506-1.747-1.506-1.747h-.2c-2.058 0-1.255-.962-1.255-.962-1.756.852-1.906 3.863.301 3.863 0 0 1.21-.15 1.21 1.405v3.864c0 1.856-1.36 1.856-1.36 1.856h-.502c-1.756 0-1.806 2.91 0 2.91h.201c.853 0 1.555-1.004 2.157-2.007.502.452.853 1.154 1.004 1.405.803 1.304 2.057.25 1.405-.803-.602-1.003-1.405-1.254-1.455-3.411z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M264.486 176.746l-1.079 2.91h9.835l1.079-2.91h-.828s-.52 0-.52-.753v-7.526c0-1.857-1.538-1.747-1.538-1.747h-5.57c-2.006 0-1.203-1.063-1.203-1.063-1.756.903-1.907 3.964 1.204 3.964h4.415s1.242-.15 1.242 1.405v4.465c0 1.205-1.141 1.255-1.141 1.255z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M153.434 228.79c-2.81 3.262.502 4.968 1.305 5.871-.402 1.355-2.266 1.656-2.266 3.162v1.906c0 1.154.752.803.752 1.405 0 .652-1.648 1.556-.142 1.556h2.509c2.007 0 1.655-1.355.853-2.51-.753-.852-1.85-1.454-1.85-2.357 0-1.255.699-1.355 1.247-1.857 6.022 5.52 4.366 4.064 5.77 6.724 2.41-3.161-.05-5.068-1.956-6.925.401-.953.752-.903 1.355-1.505.602.452.25 1.305.652 1.305 1.304 0 1.104-1.957 1.003-3.262-.2-1.706-1.706-1.756-2.609-3.512-1.756 2.258-.451 4.164-.2 4.315-.352.753-.452 1.104-1.205 1.555-4.365-3.512-4.516-4.315-5.218-5.87z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M104.666 272.394h-5.97l-1.08 2.91h7.702s2.61.05 2.61-1.806c0-1.556-3.111-3.663-3.914-5.018.652-1.003 2.157-2.408 2.157-2.408.703 1.103 1.857.903 1.857-2.007 0-1.706-1.756-1.697-1.756-1.697h-.251c-2.007 0-1.255-.962-1.255-.962-1.706.853-1.856 3.863.352 3.863-.301.1-1.957 2.007-1.857 2.007 0 0-1.054.452-1.054-3.16 0-1.757-1.504-1.748-1.504-1.748h-.251c-2.007 0-1.255-.962-1.255-.962-1.706.853-2.007 3.863.351 3.863.301 0 .904-.3 1.204 1.405.452 2.108 2.86 4.416 3.914 5.269.652.451.25.451 0 .451z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M207.235 267.503v7.729c0 1.507 1.411.389 1.411 0v-7.729c0-1.36 1.65-1.215 1.65-1.215h2.819c.048 0 1.176-.146 1.176 1.264v7.68c0 1.507 1.411.389 1.411 0v-7.729c1.118-1.41 2.37-4.037-1.47-4.037h-5.54c-1.945 0-1.167-1.018-1.167-1.018-1.701.875-1.847 3.84 1.02 3.84-.485 0-1.31.535-1.31 1.215z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M96.417 332.96v2.006c0 4.466 3.067 5.018 3.821 5.018h2.509c.752 0 3.823-.552 3.823-5.018v-4.415c0-3.613-4.526-3.503-4.526-3.503h-3.361c-2.007 0-1.255-1.063-1.255-1.063-1.706.903-1.907 4.265 1.255 3.964 0 0-2.266 1.656-2.266 3.01zm1.45 2.006v-2.007c0-1.405 2.27-3.01 2.27-3.01h2.836s2.146-.15 2.146 3.362v.652c0 3.06-2.723 3.11-2.723 3.11h-2.309s-2.22-.1-2.22-2.107z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M209.267 331.906c-1.104 1.254.602 1.154 1.054.602.602-.653 1.355-1.405 1.355-2.208v-1.505c0-1.857-1.556-1.747-1.556-1.747h-.3c-2.008 0-1.255-.963-1.255-.963-1.706.853-1.806 3.864.401 3.864 0 0 2.158-.351 1.255.752 0 0-.602.753-.954 1.205z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M41.545 300.495v1.606c0 .803.3 1.505 1.706 1.505 2.659 0 2.508-2.875.15-2.875-.25 0-.2-.243.05-.486.502-.753 1.154-1.656 2.208-1.656h2.433s1.833-.15 1.833 3.362v1.204c0 2.509-2.836 2.558-2.836 2.558h-4.842l-1.08 2.91h5.897s4.625-.05 4.625-6.522v-2.91c0-3.613-4.525-3.503-4.525-3.503h-3.412c-2.007 0-1.204-1.063-1.204-1.063-1.605.853-1.907 3.613.552 4.014-.301.15-1.555 1.104-1.555 1.856z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M263.727 305.714l-1.079 2.91h5.896s4.626-.05 4.626-6.523v-2.91c0-3.613-4.526-3.503-4.526-3.503h-3.412c-2.007 0-1.204-1.063-1.204-1.063-1.756.903-1.907 3.964 1.204 3.964h4.34s1.807-.15 1.807 3.362v1.204c0 2.509-2.81 2.559-2.81 2.559z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M158.602 357.86h-.753c-1.856 0-.702.4-1.053 1.856h-.753c0-1.866-.853-1.857-.853-1.857h-.25c-2.008 0-1.255-.963-1.255-.963-1.706.853-2.007 3.839.351 3.839 1.505 0-1.563 1.145-1.563 3.036v6.221c0 1.556 1.45.402 1.45 0v-6.02c0-.553 2.066-3.212 3.174-3.212h.602c1.204 0 3.476 2.358 3.476 4.666v1.205c0 1.203-1.168 1.254-1.168 1.254h-3.763l-1.079 2.91h4.893s2.568-.05 2.568-2.91v-3.462c0-2.86-3.47-6.564-4.024-6.564z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M162.273 378.886c0-3.387-4.372-3.308-4.372-3.308h-3.305c-1.944 0-1.167-.973-1.167-.973-1.701.847-1.847 3.717 1.167 3.717h4.204s2.062-.142 2.062 3.151v5.551c0 1.411 1.41.33 1.41 0z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M210.023 400.656l-1.079 2.91h3.136s2.603-.05 2.603-2.91v-8.279c0-1.856-1.499-1.747-1.499-1.747h-.25c-2.008 0-1.255-.962-1.255-.962-1.706.853-1.857 3.863.301 3.863 0 0 1.252-.15 1.252 1.405v4.466c0 1.204-1.152 1.254-1.152 1.254z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M96.599 392.34c0 .893.729 1.74 2.333 1.74h5.104s1.162-.141 1.162 1.317v.611c0 2.352-4.76 3.481-5.294 5.269-1.07 3.575 4.229 2.21 1.555.188-.048-.047-.097-.188 0-.235.73-.517 5.15-2.493 5.15-5.221v-2.964c0-1.74-1.456-1.709-1.456-1.709h-6.221c-.68 0-1.313-.512.097-1.63.486-.424.837-.8.837-1.412 0-1.411-2.49-1.082-2.49-.094 0 .47 1.08.188 1.08.659 0 .282-1.857.846-1.857 3.48z"
        ></path>
        <path
          strokeWidth="0.392"
          d="M155.34 499.24v-.854c0-.802-1.43-2.76-1.43-4.139 0-.702 1.205-3.186 2.46-3.186h3.512s1.881-.176 1.881 2.157v7.1c0 1.556 1.45.402 1.45 0v-9.483c0-2.785-2.253-2.675-2.253-2.675h-6.247c-2.007 0-1.204-1.063-1.204-1.063-1.756.903-1.906 3.964 1.054 3.964-1.38 0-2.182 2.76-2.182 3.337 0 1.003 1.505 2.634 1.505 3.136 0 .702-.452.652-.452.652-1.756 0-1.806 2.91 0 2.91h.502s1.405-.05 1.405-1.806z"
        ></path>
      </g>
    </svg>
  );
}

export default TreeOfLife;
