# Cybersec kubernetes lab

## Deployment

```sh
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add kyverno https://kyverno.github.io/kyverno/


helm install monitoring prometheus-community/kube-prometheus-stack --values prom-values.yml

helm install kyverno kyverno/kyverno -n kyverno --create-namespace --values kyverno-values.yml
helm install kyverno-policies kyverno/kyverno-policies -n kyverno

kubectl apply -f deployments/policies
kubectl apply -f deployments
```


## Service mesh

```sh
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.20.2 sh -
export PATH=$PWD/istio-1.20.2/bin:$PATH


istioctl install --set profile=default -y
kubectl label namespace cybersec istio-injection=enabled
```