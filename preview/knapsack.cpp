#include <iostream>
#define ll long long
#define max(x,y) ((x)>(y))?(x):(y)
using namespace std;
inline ll inp() {
    ll n = 0 , s = 1 ;
     char p = getchar_unlocked( ) ;
    if( p == '-' )
        s = -1 ;
    while( ( p < '0' || p > '9' ) && p != EOF && p != '-' )
        p = getchar_unlocked( ) ;
    if( p == '-' )
        s = -1 , p = getchar_unlocked( ) ;
    while( p >= '0' && p <= '9' )
    {
        n = ( n << 3 ) + ( n << 1 ) + ( p - '0' ) ;
        p = getchar_unlocked( ) ;
    }
    return n * s ;
}
ll dp[100003][505];
ll knapsack(int W,int wt[],ll val[],int n) {
	int i,w;
	for (i=0;i<=n;i++) {
       for(w=0;w<=W;w++) {
           if (i==0 || w==0)
               dp[i][w] = 0;
           else if (wt[i-1] <= w)
                 dp[i][w]=max(val[i-1]+dp[i-1][w-wt[i-1]],dp[i-1][w]);
           else
                 dp[i][w] = dp[i-1][w];
       }
   }
 
   return dp[n][W];
}
int main() {
	int t;
	scanf("%d",&t);
	while(t--) { 
		int n,m,remmoney;
		scanf("%d%d%d",&n,&remmoney,&m);
		int i,j;
		ll rate[n],sum=0;
		ll neg[n];
		int negidx[n],tree[n];
		int k=0;
		for(i=0;i<n;i++) {
			tree[i]=1000;//avoiding memset
		    rate[i]=inp(); //array input
			if(rate[i]<0) {
				neg[k]=-1*rate[i];//storing negative values
				negidx[k++]=i; //storing indices of negative values (not used)
			}
			sum+=rate[i];// adding all the ratings
		}
		int l,r;
		int c;
		for(i=0;i<m;i++) {
		    scanf("%d%d%d",&l,&r,&c);
			l--;r--;
			for(j=l;j<=r;j++) {
				//if(tree[j]==0) tree[j]=c; 
				 (tree[j]>c)?(tree[j]=c):(tree[j]=tree[j]);
				//}//forming min array
			}
		}
		int minarr[n];
		k=0;
		for(i=0;i<n;i++) {
			if(rate[i]<0) minarr[k++]=tree[i];//forming minarray for thier corresponding -ve ratings 
		}
		//memset(dp,0,sizeof(dp));
		ll ans;
		if(k) { // if rating array has negative values
			ans=knapsack(remmoney,minarr,neg,k);//knapsack- (minarray as weight) (neg as profit array) 
		    sum+=ans;//adding to the previous sum
		}
		else {
			// no negative values ,so no need to compute knapsack
		}
		cout<<ans<<endl;
	}
	return 0;
}