#include<iostream>
using namespace std;
int ar[105][105];
int main()
{
	long long int t;
	cin>>t;
	while(t--)
	{
		long long int n,m;
		cin>>n>>m;
		for(int i=0;i<n;i++)
		{
			for(int j=0;j<m;j++)
			{
				cin>>ar[i][j];
			}
		}
		long long int ma,highest=0;;
		if(n>=m)
			ma=n;
		else
			ma=m;
		for(int i=0;i<n;i++)
		{
			for(int j=0;j<m;j++)
			{
				long long int val=ar[i][j];
				for(int k=1;k<=ma;k++)
				{
					if(i+k>=n || j+k>=m || i-k<0 || j-k<0)
						break;
					val+=(ar[i+k][j+k]+ar[i+k][j-k]+ar[i-k][j-k]+ar[i-k][j+k]);
					if(val>highest)
						highest=val;
				}
				if(i+1>=n || j+1>=m)
					break;
				val=ar[i][j]+ar[i+1][j]+ar[i][j+1]+ar[i+1][j+1];
				if(val>highest)
						highest=val;
				for(int k=1;k<=ma;k++)
				{
					if(i+k+1>=n || j+k+1>=m || i-k<0 || j-k<0)
						break;
					val+=(ar[i+k][j+k]+ar[i+k][j-k]+ar[i-k][j-k]+ar[i-k][j+k]);
					if(val>highest)
						highest=val;
				}
			}
		}
		cout<<highest<<endl;
	}	
	return 0;
}