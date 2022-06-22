// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom;

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st){

    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st,PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st,PI);
    }

    return _st;
}

// void main (void) {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;

//     st = tile(st,u_zoom);
//     st = rotateTilePattern(st);

//     // Make more interesting combinations
//     // st = tile(st,2.0);
//     // st = rotate2D(st,-PI*u_time*0.25);
//     // st = rotateTilePattern(st*2.);
//     // st = rotate2D(st,PI*u_time*0.25);

//     // step(st.x,st.y) just makes a b&w triangles
//     // but you can use whatever design you want.
//     gl_FragColor = vec4(vec3(step(st.x,st.y)),1.0);
// }


#define AA 1


float hash(vec2 p)  // replace this by something better
{
    p  = fract( p*0.6180339887 );
    p *= 25.0;
    return fract( p.x*p.y*(p.x+p.y) );
}

// consider replacing this by a proper noise function
float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float a = hash(p+vec2(0,0));
	float b = hash(p+vec2(1,0));
	float c = hash(p+vec2(0,1));
	float d = hash(p+vec2(1,1));
    return mix(mix( a, b,f.x), mix( c, d,f.x),f.y);
}

const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*(-1.0+2.0*noise( p )); p = mtx*p*2.02;
    f += 0.2500*(-1.0+2.0*noise( p )); p = mtx*p*2.03;
    f += 0.1250*(-1.0+2.0*noise( p )); p = mtx*p*2.01;
    f += 0.0625*(-1.0+2.0*noise( p ));
    return f/0.9375;
}

float fbm6( vec2 p )
{
    float f = 0.0;
    f += 0.500000*noise( p ); p = mtx*p*2.02;
    f += 0.250000*noise( p ); p = mtx*p*2.03;
    f += 0.125000*noise( p ); p = mtx*p*2.01;
    f += 0.062500*noise( p ); p = mtx*p*2.04;
    f += 0.031250*noise( p ); p = mtx*p*2.01;
    f += 0.015625*noise( p );
    return f/0.96875;
}

vec2 fbm4_2( vec2 p )
{
    return vec2( fbm4(p+vec2(1.0)), fbm4(p+vec2(6.2)) );
}

vec2 fbm6_2( vec2 p )
{
    return vec2( fbm6(p+vec2(9.2)), fbm6(p+vec2(5.7)) );
}

float func( vec2 q, out vec2 o, out vec2 n )
{
    q += 0.05*sin(vec2(0.11,0.13)*u_time + length( q )*4.0);
    
    q *= 0.7 + 0.2*cos(0.05*u_time);

    o = 0.5 + 0.5*fbm4_2( q );
    
    o += 0.02*sin(vec2(0.13,0.11)*u_time*length( o ));

    n = fbm6_2( 4.0*o );

    vec2 p = q + 2.0*n + 1.0;

    float f = 0.5 + 0.5*fbm4( 2.0*p );

    f = mix( f, f*f*f*3.5, f*abs(n.x) );

    f *= 1.0-0.5*pow( 0.5+0.5*sin(8.0*p.x)*sin(8.0*p.y), 8.0 );

    return f;
}

float funcs( in vec2 q )
{
    vec2 t1, t2;
    return func(q,t1,t2);
}

void main(void )
{
    vec3 tot = vec3(0.0);
#if AA>1
    for( int mi=0; mi<AA; mi++ )
    for( int ni=0; ni<AA; ni++ )
    {
        // pixel coordinates
        vec2 of = vec2(float(mi),float(ni)) / float(AA) - 0.5;
        vec2 q = (2.0*(gl_FragCoord+of)-u_resolution.xy)/u_resolution.y;
#else    
        vec2 q = (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
#endif

        vec2 o, n;
        float f = func(q, o, n);
        
        vec3 col = vec3(0.2,0.1,0.4);
        col = mix( col, vec3(0.3,0.05,0.05), f );
        col = mix( col, vec3(0.9,0.9,0.9), dot(n,n) );
        col = mix( col, vec3(0.5,0.2,0.2), 0.5*o.y*o.y );
        col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(n.y)+abs(n.x)) );
        col *= f*2.0;

        vec2 ex = vec2( 1.0 / u_resolution.x, 0.0 );
        vec2 ey = vec2( 0.0, 1.0 / u_resolution.y );
        #if AA>1
        ex /= float(AA);
        ey /= float(AA);
        #endif
        vec3 nor = normalize( vec3( funcs(q+ex) - f, ex.x, funcs(q+ey) - f ) );
        
        vec3 lig = normalize( vec3( 0.9, -0.2, -0.4 ) );
        float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );

        vec3 lin  = vec3(0.85,0.90,0.95)*(nor.y*0.5+0.5);
             lin += vec3(0.15,0.10,0.05)*dif;

        col *= lin;
        col = vec3(1.0)-col;
        col = col*col;
        col *= vec3(1.2,1.25,1.2);
        
        tot += col;
#if AA>1
    }
    tot /= float(AA*AA);
#endif
    
	vec2 p = gl_FragCoord.xy / u_resolution.xy;
	tot *= 0.5 + 0.5 * sqrt(16.0*p.x*p.y*(1.0-p.x)*(1.0-p.y));
	
	gl_FragColor = vec4( tot, 1.0 );
}





