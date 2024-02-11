# Cybersec kubernetes lab

## Deployment

The deployments are made for a kubernetes environment with an nginx ingress controller.

On minikube : 

```sh
minikube start
```


### Service mesh

Install istio

```sh
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.20.2 sh -
export PATH=$PWD/istio-1.20.2/bin:$PATH


istioctl install --set profile=default -y

kubectl create namespace cybersec
kubectl label namespace cybersec istio-injection=enabled
```

### Main deployment

```sh
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack --values prom-values.yml

helm install kyverno kyverno/kyverno -n kyverno --create-namespace --values kyverno-values.yml
helm install kyverno-policies kyverno/kyverno-policies -n kyverno

kubectl apply -f deployments/policies
kubectl apply -f deployments/istio
kubectl apply -f deployments
```

### Access the api : 

```sh
minikube tunnel &

export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')

export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT

curl $GATEWAY_URL
```
